# NoteApp - MERN Stack Notes Application

A full-stack notes application built with MongoDB, Express, React, and Node.js as part of the 10 Pearls MERN Internship Program.

---

## Features

- User authentication with email/password and Google OAuth
- Forgot and reset password via email
- Create, read, update and delete notes
- Pin, archive and trash notes
- Categories: Work, Personal, Ideas, General
- Search notes in real time
- Dark and light mode
- Export notes as JSON, CSV or PDF
- Import notes from JSON file
- Profile management with avatar upload
- Guest mode to try the app without an account

---

## Tech Stack

**Frontend:** React, Vite, React Router, Axios, React Quill, Context API

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt, Passport.js, Nodemailer, Multer

---

## Project Structure

```
10P-Shine-MERN/
├── .github/
│   └── workflows/
│       └── sonar.yml
├── frontend/
│   ├── src/
│   │   ├── __tests__/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── sonar-project.properties
│   └── package.json
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── test/
│   ├── sonar-project.properties
│   └── server.js
└── README.md
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Google Cloud Console account
- Gmail account

### Backend

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:5173
EMAIL_FROM=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Create `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Open `http://localhost:5173`

---

## Testing

### Backend — Mocha + Chai + Supertest

```bash
cd backend
npm test
```

**21 tests passing** — covers Auth and Notes API routes

### Frontend — Jest + React Testing Library

```bash
cd frontend
npm test -- --coverage --watchAll=false
```

**98 tests passing across 13 suites** — covers Login, Register, Dashboard, NoteEditor, ForgotPassword, ResetPassword, AuthCallback, ThemeContext, Profile, GuestDashboard, Navbar, PrivateRoute, api

---

## Code Quality — SonarQube

Both projects are analyzed using SonarQube Community Edition running locally on `http://localhost:9000`.

| Project | Quality Gate | Security | Reliability | Maintainability | Coverage |
|---|---|---|---|---|---|
| Frontend | ✅ Passed | A | C | A | 26.3% |
| Backend | ✅ Passed | A | A | A | 46.6% |

To run analysis locally:

```bash
# Frontend
cd frontend
npx sonar -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=YOUR_TOKEN \
  -Dsonar.projectKey=frontend-project

# Backend
cd backend
npm run coverage
npx sonar -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=YOUR_TOKEN \
  -Dsonar.projectKey=backend-project
```

---

## CI/CD

GitHub Actions automatically runs on every push:

- Installs frontend dependencies
- Runs Jest tests with coverage report
- Performs SonarQube code quality analysis

Workflow file: `.github/workflows/sonar.yml`

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/forgot-password` | Send reset email |
| POST | `/api/auth/reset-password` | Reset password |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/change-password` | Change password |
| GET | `/api/auth/google` | Google OAuth |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes |
| POST | `/api/notes` | Create note |
| GET | `/api/notes/:id` | Get single note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |
| PATCH | `/api/notes/:id/pin` | Pin or unpin note |
| PATCH | `/api/notes/:id/archive` | Archive note |
| PATCH | `/api/notes/:id/trash` | Trash note |
| PATCH | `/api/notes/:id/restore` | Restore note |

---

## Git Workflow

| Branch | Purpose |
|---|---|
| `main` | Production ready |
| `develop` | Integration branch |
| `feature/*` | New features |
| `refactor/*` | Code improvements |
| `fix/*` | Bug fixes |
| `docs/*` | Documentation updates |

---

## Author

Haris Naseer — [GitHub](https://github.com/HarisNaseer7)

---

*This project is part of the 10 Pearls MERN Internship Program.*
