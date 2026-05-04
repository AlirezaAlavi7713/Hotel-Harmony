# 🏨 Hotel Harmony

Application full-stack de gestion hôtelière avec espace client et espace staff.

## Fonctionnalités

**Espace client**
- Consultation et réservation des chambres
- Paiement en ligne via Stripe
- Dashboard personnel avec suivi des réservations
- Messagerie avec le staff

**Espace staff / admin**
- Gestion des chambres (CRUD)
- Suivi des réservations
- Gestion des employés
- Messagerie client
- Dashboard avec statistiques

## Stack technique

| Côté | Technologies |
|------|-------------|
| Frontend | React, Vite, React Router DOM, Axios |
| Backend | Node.js, Express, MySQL, JWT, bcrypt |
| Paiement | Stripe |
| Upload | Multer |
| Tests | Jest |

## Structure du projet

```
Hotel-Harmony/
├── Hotel-Harmony-Front/   # Application React
└── Hotel-Harmony-Back/    # API Express
```

## Installation

**Backend**
```bash
cd Hotel-Harmony-Back
npm install
cp .env.example .env      # Remplir les variables
npm run dev               # http://localhost:3001
```

**Frontend**
```bash
cd Hotel-Harmony-Front
npm install
npm run dev               # http://localhost:5173
```

## Variables d'environnement (Back)

```
SERVER_PORT=3001
DB_HOST=localhost
DB_USER=
DB_PASSWORD=
DB_NAME=gestion_hotel
JWT_SECRET=
STRIPE_SECRET_KEY=
FRONTEND_URL=http://localhost:5173
```
