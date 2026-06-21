# PropSpace

PropSpace is a full-stack property listing application. Authenticated users can list properties for rent or sale, manage their own listings, and update their account settings. Anyone, including guests can browse and search the public feed.

It was built as a MERN-stack project using TypeScript end to end:

- **Backend** - Node.js, Express, MongoDB (Mongoose), JWT authentication, layered architecture (routes → controllers/services → repositories)
- **Frontend** - React (Vite), TypeScript, Tailwind CSS, React Router, Axios

---

## Table of contents

- [Features](#features)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
  - [1. Clone the repository](#1-clone-the-repository)
  - [2. Set up MongoDB](#2-set-up-mongodb)
  - [3. Backend setup](#3-backend-setup)
  - [4. Frontend setup](#4-frontend-setup)
  - [5. Run the app](#5-run-the-app)
- [Environment variables](#environment-variables)
- [API reference](#api-reference)
- [Scripts reference](#scripts-reference)
- [Troubleshooting](#troubleshooting)

---

## Features

**Authentication & accounts**

- Register and log in with a hashed/salted password (bcrypt) and a JWT session
- Update profile (username, phone, avatar) and change password (requires the old password)
- Protected routes on both the API and the frontend — pages like the dashboard redirect to login if you're signed out

**Property listings**

- Public feed of all listings, filterable by city and price range — no login required
- "My Listings" dashboard showing only properties you own
- Create, edit, and delete listings (only the listing's author can edit or delete it — enforced server-side, not just hidden in the UI)
- Each listing has a title, description, price, location, property type (Apartment / House / Studio), listing type (rent / sale), and image URLs

**Engineering details**

- Backend follows a strict 3-layer architecture: routes only parse/route, services hold business logic, repositories are the only layer that talks to MongoDB
- Ownership checks happen in dedicated middleware before any database write
- Frontend uses a global Axios instance with an interceptor that auto-attaches the JWT to every request
- Fully typed on both ends — no `any` left unaddressed, `tsc --noEmit` passes clean on both projects

---

## Project structure

```
propspace/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection
│   │   ├── controllers/     # Parses requests, calls services, shapes responses
│   │   ├── middleware/      # JWT auth guard, ownership guard
│   │   ├── models/          # Mongoose schemas (User, Property)
│   │   ├── repositories/    # All direct database queries live here
│   │   ├── routes/          # Express routers
│   │   ├── services/        # Business logic & validation
│   │   ├── types/           # Shared TypeScript interfaces
│   │   └── app.ts           # App entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios calls grouped by resource (auth, user, property)
│   │   ├── components/
│   │   │   ├── ui/          # Button, Input, Select, Spinner, EmptyState, etc.
│   │   │   ├── layout/      # Navbar, ProtectedRoute
│   │   │   └── property/    # PropertyCard, PropertyForm, FilterSidebar
│   │   ├── context/         # AuthContext (global auth state)
│   │   ├── pages/           # One file per route
│   │   ├── types/           # Shared TypeScript interfaces
│   │   ├── App.tsx          # Route definitions
│   │   └── main.tsx         # App entry point
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
│
└── README.md                # You are here
```

---

## Prerequisites

Install these before you start:

| Tool    | Minimum version                                                                                          | Check with         |
| ------- | -------------------------------------------------------------------------------------------------------- | ------------------ |
| Node.js | 18.x or later                                                                                            | `node -v`          |
| npm     | 9.x or later (ships with Node)                                                                           | `npm -v`           |
| MongoDB | 6.x or later (local) **or** a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster | `mongod --version` |
| Git     | any recent version                                                                                       | `git --version`    |

You do **not** need to install TypeScript globally — it's a project dependency and runs through `npm` scripts.

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/BESINGI-MARINUS/propspace
cd propspace
```

If you received this project as a `.zip` file instead, extract it and `cd` into the resulting `propspace` folder.

### 2. Set up MongoDB

Pick one of the following:

**Option A — Local MongoDB**
Make sure MongoDB is installed and running on your machine:

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod

# Windows
# Start the "MongoDB" service from Services, or run mongod.exe
```

Your local connection string will be: `mongodb://localhost:27017/propspace`

**Option B — MongoDB Atlas (cloud, no local install)**

1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas/register)
2. Under **Database Access**, create a user with a username and password
3. Under **Network Access**, allow your current IP (or `0.0.0.0/0` for development)
4. Click **Connect → Drivers**, copy the connection string — it looks like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/propspace?retryWrites=true&w=majority`

You'll paste whichever connection string you choose into the backend `.env` file in the next step.

### 3. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open the new `.env` file and fill in your own values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/propspace
JWT_SECRET=replace_this_with_a_long_random_string
JWT_EXPIRES_IN=7d
```

> Generate a strong `JWT_SECRET` with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 4. Frontend setup

Open a **second terminal** (leave the backend terminal free for later):

```bash
cd frontend
npm install
cp .env.example .env
```

The default `frontend/.env` already points at the backend's default port, so you usually don't need to change it:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Run the app

**Terminal 1 — backend** (from the `backend/` folder):

```bash
npm run dev
```

You should see:

```
MongoDB connected: <host>
Server running on port 5000
```

**Terminal 2 — frontend** (from the `frontend/` folder):

```bash
npm run dev
```

Vite will print a local URL, typically:

```
Local:   http://localhost:5173/
```

Open that URL in your browser. Register a new account, then you're in.

---

## Environment variables

### Backend (`backend/.env`)

| Variable         | Description                          | Example                               |
| ---------------- | ------------------------------------ | ------------------------------------- |
| `PORT`           | Port the Express server listens on   | `5000`                                |
| `MONGO_URI`      | MongoDB connection string            | `mongodb://localhost:27017/propspace` |
| `JWT_SECRET`     | Secret String used to sign JWTs      | `a1b2c3...` (32+ random bytes)        |
| `JWT_EXPIRES_IN` | How long a login session stays valid | `7d`                                  |

### Frontend (`frontend/.env`)

| Variable       | Description                             | Example                     |
| -------------- | --------------------------------------- | --------------------------- |
| `VITE_API_URL` | Base URL the frontend calls for the API | `http://localhost:5000/api` |

---

## API reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint           | Auth required            | Description                                         |
| ------ | ------------------ | ------------------------ | --------------------------------------------------- |
| POST   | `/auth/register`   | No                       | Create a new account                                |
| POST   | `/auth/login`      | No                       | Log in, returns a JWT                               |
| GET    | `/users/profile`   | Yes                      | Get your own profile                                |
| PUT    | `/users/profile`   | Yes                      | Update username / phone / avatar                    |
| PUT    | `/users/password`  | Yes                      | Change password (requires old password)             |
| GET    | `/properties`      | No                       | Public feed — supports `?city=&minPrice=&maxPrice=` |
| GET    | `/properties/mine` | Yes                      | Listings you own                                    |
| GET    | `/properties/:id`  | No                       | Single listing detail                               |
| POST   | `/properties`      | Yes                      | Create a listing                                    |
| PUT    | `/properties/:id`  | Yes (must be the author) | Update a listing                                    |
| DELETE | `/properties/:id`  | Yes (must be the author) | Delete a listing                                    |

Authenticated requests must include the header:

```
Authorization: Bearer <your-jwt-token>
```

The frontend handles this automatically once you're logged in.

---

## Scripts reference

### Backend (`backend/package.json`)

| Command         | Purpose                                                     |
| --------------- | ----------------------------------------------------------- |
| `npm run dev`   | Run the API with hot reload (`ts-node-dev`)                 |
| `npm run build` | Compile TypeScript to `dist/`                               |
| `npm start`     | Run the compiled output (`dist/app.js`) — use after `build` |

### Frontend (`frontend/package.json`)

| Command           | Purpose                                             |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with hot reload           |
| `npm run build`   | Type-check and build a production bundle to `dist/` |
| `npm run preview` | Preview the production build locally                |
| `npm run lint`    | Run ESLint                                          |

---

## Troubleshooting

**`MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017`**
MongoDB isn't running locally. Either start it (see [Set up MongoDB](#2-set-up-mongodb)) or switch `MONGO_URI` in `backend/.env` to an Atlas connection string.

**Frontend loads but every request fails / shows network errors**
Check that the backend is actually running on the port referenced by `VITE_API_URL` in `frontend/.env`. By default that's `http://localhost:5000/api`.

**"Invalid token" or getting logged out unexpectedly**
The JWT may have expired (`JWT_EXPIRES_IN` in `backend/.env`), or `JWT_SECRET` was changed after the token was issued. Log in again.

**Port already in use**
Another process is using port `5000` or `5173`. Either stop that process or change `PORT` (backend `.env`) / pass a different port to Vite (`npm run dev -- --port 5174`).

**`npm install` fails on the backend with peer dependency errors**
Run `npm install --legacy-peer-deps` as a fallback, though this shouldn't normally be necessary with the versions pinned in `package.json`.
