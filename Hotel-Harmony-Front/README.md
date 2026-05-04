# Hotel Harmony

Hotel Harmony est une application web de gestion hoteliere construite avec un frontend `React + Vite` et un backend `Node.js + Express + MySQL`.

Le projet couvre trois usages principaux :
- navigation publique sur le site de l'hotel
- espace client pour reserver et gerer ses sejours
- espace staff pour administrer les operations

## Apercu

Fonctionnalites disponibles :
- consultation des chambres
- detail d'une chambre
- inscription et connexion client
- connexion staff et admin
- creation de reservation
- paiement mock d'une reservation
- dashboard client
- dashboard staff
- gestion des messages de contact
- gestion des chambres
- gestion des employes pour les administrateurs

## Stack technique

### Frontend
- React
- Vite
- React Router DOM
- Axios
- Bootstrap
- React-Bootstrap

### Backend
- Node.js
- Express
- MySQL2
- JWT
- bcrypt
- CORS

## Architecture du projet

```text
Hotel-Harmony/
├── src/                         # Frontend React
│   ├── assets/
│   ├── components/
│   ├── css/
│   ├── pages/
│   ├── routes/
│   └── services/
├── public/
├── package.json                 # Frontend
├── gestion_hotel_backend/       # Backend Express
│   ├── config/
│   ├── controller/
│   ├── middlewares/
│   ├── model/
│   ├── route/
│   ├── tests/
│   ├── uploads/
│   ├── index.js
│   └── package.json
└── README.md
```

## Organisation applicative

### Frontend

Le frontend est situe a la racine du projet.

Points d'entree :
- [`src/main.jsx`](/Users/alirezaalavi/Desktop/Hotel-Harmony/src/main.jsx)
- [`src/App.jsx`](/Users/alirezaalavi/Desktop/Hotel-Harmony/src/App.jsx)

Repertoires principaux :
- [`src/pages`](/Users/alirezaalavi/Desktop/Hotel-Harmony/src/pages) : pages de l'application
- [`src/components`](/Users/alirezaalavi/Desktop/Hotel-Harmony/src/components) : composants reutilisables
- [`src/services`](/Users/alirezaalavi/Desktop/Hotel-Harmony/src/services) : couche d'appels API
- [`src/routes`](/Users/alirezaalavi/Desktop/Hotel-Harmony/src/routes) : protection des routes selon le role

### Backend

Le backend est situe dans [`gestion_hotel_backend`](/Users/alirezaalavi/Desktop/Hotel-Harmony/gestion_hotel_backend).

Points d'entree :
- [`gestion_hotel_backend/index.js`](/Users/alirezaalavi/Desktop/Hotel-Harmony/gestion_hotel_backend/index.js)
- [`gestion_hotel_backend/config/bdd.js`](/Users/alirezaalavi/Desktop/Hotel-Harmony/gestion_hotel_backend/config/bdd.js)

Repertoires principaux :
- [`gestion_hotel_backend/route`](/Users/alirezaalavi/Desktop/Hotel-Harmony/gestion_hotel_backend/route) : declaration des endpoints
- [`gestion_hotel_backend/controller`](/Users/alirezaalavi/Desktop/Hotel-Harmony/gestion_hotel_backend/controller) : logique HTTP
- [`gestion_hotel_backend/model`](/Users/alirezaalavi/Desktop/Hotel-Harmony/gestion_hotel_backend/model) : acces base de donnees
- [`gestion_hotel_backend/middlewares`](/Users/alirezaalavi/Desktop/Hotel-Harmony/gestion_hotel_backend/middlewares) : JWT et controle des roles

## Roles applicatifs

- `client`
- `employe`
- `admin`

## Entites metier principales

- `clients`
- `employes`
- `chambres`
- `type_chambre`
- `services`
- `chambre_service`
- `photos_chambre`
- `reservations`
- `paiements`
- `messages_contact`

## Parcours fonctionnels

### Parcours public
- consulter la page d'accueil
- parcourir les chambres disponibles
- voir le detail d'une chambre
- envoyer un message via le formulaire de contact

### Parcours client
- creer un compte
- se connecter
- reserver une chambre
- payer une reservation
- consulter ses reservations
- annuler une reservation
- consulter le detail d'une reservation
- mettre a jour son profil

### Parcours staff
- se connecter
- consulter toutes les reservations
- filtrer et rechercher des reservations
- annuler une reservation
- consulter les messages de contact
- marquer un message comme lu
- enregistrer une reponse a un message
- gerer les chambres

### Parcours admin
- creer un employe
- modifier un employe
- supprimer un employe

## Installation

### 1. Cloner le projet

```bash
git clone <repo>
cd Hotel-Harmony
```

### 2. Installer les dependances du frontend

```bash
npm install
```

### 3. Installer les dependances du backend

```bash
cd gestion_hotel_backend
npm install
cd ..
```

## Configuration

### Variables d'environnement du frontend

Fichier : `.env`

```env
VITE_URL_API=http://localhost:3000/api
```

### Variables d'environnement du backend

Fichier : `gestion_hotel_backend/.env`

```env
SERVER_PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hotel_harmony
DB_PORT=3306
JWT_SECRET=change_this_secret
```

## Demarrage rapide

### Lancer le backend

Depuis [`gestion_hotel_backend`](/Users/alirezaalavi/Desktop/Hotel-Harmony/gestion_hotel_backend) :

```bash
npm run dev
```

ou

```bash
npm start
```

### Lancer le frontend

Depuis la racine :

```bash
npm run dev
```

En local :
- frontend : `http://localhost:5173`
- backend : `http://localhost:3000`

## Scripts disponibles

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Backend

```bash
npm run dev
npm start
npm test
```

## Authentification et securite

L'application utilise des tokens JWT.

Authentification disponible :
- `POST /api/client/login`
- `POST /api/employes/login`

Le frontend stocke le token dans le `localStorage` puis l'envoie avec :

```http
Authorization: Bearer <token>
```

Le backend controle ensuite :
- la validite du token
- le role autorise sur chaque route protegee

## Routes principales

### Routes frontend
- `/`
- `/rooms`
- `/rooms/:id`
- `/auth`
- `/dashboard`
- `/payment/:id`
- `/reservation/:id`
- `/contact`
- `/staff`
- `/staff/messages`
- `/staff/rooms`
- `/staff/employees`

### Routes API principales
- `POST /api/client`
- `POST /api/client/login`
- `GET /api/client/me`
- `PUT /api/client/me`
- `POST /api/employes/login`
- `GET /api/chambres`
- `GET /api/chambre/:id`
- `POST /api/reservation`
- `GET /api/reservations/me`
- `GET /api/reservations`
- `PATCH /api/reservation/:id/annuler`
- `POST /api/paiements/initier`
- `POST /api/paiements/confirmer`
- `POST /api/contact`
- `GET /api/contact/messages`

## Paiement

Le paiement est actuellement simule.

Flux actuel :
1. creation d'une reservation avec statut `en_attente`
2. initialisation du paiement avec calcul du montant
3. confirmation manuelle du paiement
4. passage de la reservation en `confirmee`

## Tests

Le backend contient une base de tests dans [`gestion_hotel_backend/tests`](/Users/alirezaalavi/Desktop/Hotel-Harmony/gestion_hotel_backend/tests).

Execution :

```bash
cd gestion_hotel_backend
npm test
```

## Limites actuelles

- pas de schema SQL versionne dans le depot
- pas de migration automatisee de base de donnees
- paiement non connecte a un vrai prestataire
- quelques URLs medias sont encore en dur dans le frontend
- README sans captures ni diagrammes techniques

## Pistes d'amelioration

- ajouter un dump SQL ou des migrations
- documenter le schema relationnel
- centraliser la configuration API et les URLs de medias
- renforcer la protection de certaines routes backend
- ajouter des tests d'integration API
- ajouter des tests frontend
- preparer une strategie de deploiement

## Auteur

Alireza Alavi