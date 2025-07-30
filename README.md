# 📝 Notes Web App

> ⚙️ **Status**: Currently in Development  
> 🚧 Features are being implemented step by step

---

A full-stack Notes application built with **NestJS**, **Next.js**, **PostgreSQL**, and **Tailwind CSS**.  
Includes authentication, user management, note CRUD features, and error tracking.

---

## ⚙️ Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeORM, PostgreSQL, JWT Auth
- **Other**: Jest, Supertest, Sentry, Docker, GitHub Actions

---

## 📦 Installation

### 1. Clone Repo

```bash
git clone https://github.com/your-username/notes-app.git
cd notes-app
```

### 2. Set up Environment Variables

#### `/frontend/.env`
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

#### `/backend/.env`
```
DATABASE_URL=postgres://user:pass@localhost:5432/notesdb
JWT_SECRET=yourSecret
SENTRY_DSN=yourSentryLink
```

### 3. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

---

## 🚀 Running the App

### Frontend (Next.js)
```bash
cd frontend
npm run dev
```

### Backend (NestJS)
```bash
cd backend
npm run start:dev
```

---

## 🧪 Testing

Run all backend tests:
```bash
cd backend
npm run test
```

---

## 🐞 Debugging

- View API errors in terminal or check Sentry dashboard
- Use Postman to manually test backend routes
- Auth token is managed via **HttpOnly cookie**

---

## 🔒 Authentication Flow

- Login: POST `/auth/login` → sets JWT cookie
- Logout: POST `/auth/logout` → clears cookie
- Protected routes require valid cookie on request

---

## 📁 Folder Structure (short)

```
├── frontend/
│   ├── app/
│   ├── components/
│   └── ...
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── notes/
│   │   └── users/
└── README.md
```

---

## 🧠 Notes

- Uses `class-validator` for backend validation
- Uses `Framer Motion` for animations
- Supports dark mode & responsive design

---

## 🔗 Links

- [Project Board](https://github.com/your-username/notes-app/projects)

