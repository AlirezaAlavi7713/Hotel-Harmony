import Stripe from "stripe";
import {
  getReservationById,
  confirmReservation,
  getReservationForPricing,
} from "../model/ResaModel.js";
import {
  createPaiement,
  getPaiementByReservation,
  updatePaiementStatus,
  attachStripeSessionToPaiement,
  getPaiementByStripeSessionId,
} from "../model/PaiementModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const computeReservationAmount = (resa) => {
  const start = new Date(resa.date_debut);
  const end = new Date(resa.date_fin);
  const diffMs = end - start;
  const nbNuits = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (nbNuits <= 0) {
    return { error: "Dates invalides" };
  }

  const prixNuit = Number(resa.prix_nuit);
  const montant = Number((prixNuit * nbNuits).toFixed(2));

  return { nbNuits, prixNuit, montant };
};

// INITIER PAIEMENT

export const initierPaiementController = async (req, res) => {
  try {
    const id_client = req.user.id ?? req.user.id_client;
    const { id_reservation } = req.body;

    if (!id_reservation) {
      return res.status(400).json({ message: "id_reservation requis" });
    }

    // récupérer infos réservation + prix nuit
    const resa = await getReservationForPricing(id_reservation);
    if (!resa) return res.status(404).json({ message: "Réservation introuvable" });

    // sécurité : appartient au client
    if (resa.id_client !== id_client)
      return res.status(403).json({ message: "Accès refusé" });

    // déjà payée / annulée
    if (resa.statut !== "en_attente")
      return res.status(409).json({ message: "Cette réservation ne peut plus être payée" });

    // anti double paiement
    const lastPay = await getPaiementByReservation(id_reservation);
    if (lastPay && lastPay.statut === "reussi")
      return res.status(409).json({ message: "Réservation déjà payée" });

    const { nbNuits, prixNuit, montant, error } = computeReservationAmount(resa);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const paiement = await createPaiement(id_reservation, id_client, montant);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${frontendUrl}/payment/${id_reservation}?status=success`,
      cancel_url: `${frontendUrl}/payment/${id_reservation}?status=cancel`,
      customer_email: req.user.email || undefined,
      metadata: {
        id_reservation: String(id_reservation),
        id_client: String(id_client),
        id_paiement: String(paiement.insertId),
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: Math.round(montant * 100),
            product_data: {
              name: `Reservation #${id_reservation}`,
              description: `${nbNuits} nuit(s) a ${prixNuit.toFixed(2)} EUR`,
            },
          },
        },
      ],
    });

    await attachStripeSessionToPaiement(
      paiement.insertId,
      session.id,
      typeof session.payment_intent === "string" ? session.payment_intent : null
    );

    return res.status(201).json({
      message: "Session Stripe Checkout créée",
      paiement_id: paiement.insertId,
      prix_nuit: prixNuit,
      nb_nuits: nbNuits,
      montant,
      checkout_url: session.url,
      session_id: session.id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

export const stripeWebhookController = async (req, res) => {
  try {
    const signature = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return res.status(400).send("Webhook Stripe mal configuré");
    }

    const event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const paiement = await getPaiementByStripeSessionId(session.id);

      if (!paiement) {
        return res.status(200).json({ received: true });
      }

      const resa = await getReservationById(paiement.id_reservation);
      if (!resa) {
        return res.status(200).json({ received: true });
      }

      if (paiement.statut !== "reussi") {
        await attachStripeSessionToPaiement(
          paiement.id_paiement,
          session.id,
          typeof session.payment_intent === "string" ? session.payment_intent : null
        );
        await updatePaiementStatus(paiement.id_paiement, "reussi");
      }

      if (resa.statut !== "confirmee") {
        await confirmReservation(resa.id_reservation);
      }
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      const paiement = await getPaiementByStripeSessionId(session.id);
      if (paiement && paiement.statut === "en_attente") {
        await updatePaiementStatus(paiement.id_paiement, "echoue");
      }
    }

    return res.json({ received: true });
  } catch (err) {
    console.error(err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
