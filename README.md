# 📝 Notes Web App

[![Live on Vercel](https://img.shields.io/badge/Live-Vercel-000?logo=vercel)](https://notes-web-app-tan.vercel.app/)
[![CI](https://img.shields.io/github/actions/workflow/status/Hikko218/Notes-Web-App/backend-test.yml?label=Build&logo=githubactions)](https://github.com/Hikko218/My-Portfolio/actions)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?logo=linkedin)](https://www.linkedin.com/in/heiko-ries-b35778374)

---

A full-stack Notes application built with **NestJS**, **Next.js**, **PostgreSQL**, and **Tailwind CSS**.  
This app provides a robust and user-friendly platform for managing notes, complete with authentication, folder organization, and error tracking.
Sign up now and explore all features!

---

## 🖼️ Preview

![Screenshot](./Frontend/public/Notes_App_Titel_Picture.png)

---

## ⚙️ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-15-000?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styling-38BDF8?logo=tailwindcss)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-4169E1?logo=postgresql)
![Nodemailer](https://img.shields.io/badge/Nodemailer-Email-009688?logo=gmail)
![Brevo](https://img.shields.io/badge/Brevo-SMTP-074A64?logo=maildotru)
![Jest](https://img.shields.io/badge/Jest-Tests-C21325?logo=jest)
![Supertest](https://img.shields.io/badge/Supertest-E2E_Tests-555555)
![Sentry](https://img.shields.io/badge/Sentry-Monitoring-362D59?logo=sentry)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel)

---

## 🌟 Features

- **Authentication**: Secure login/logout with JWT and HttpOnly cookies
- **Notes Management**: Create, edit, delete, and organize notes into folders
- **Folder Organization**: Group notes into folders for better categorization
- **Database Integration**: Fully connected to a PostgreSQL database using Prisma ORM
- **Error Tracking**: Integrated with Sentry for real-time error monitoring
- **Responsive Design**: Fully responsive UI
- **Testing**: Comprehensive backend tests with Jest and Supertest
- **Deployment**: Dockerized and deployed with CI/CD pipelines

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
NEXT_PUBLIC_API_URL=https://your-deployed-backend-url/api
```

#### `/backend/.env`

```
DATABASE_URL=postgres://user:pass@your-database-url:5432/notesdb
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
npm run test:ci
```

---

## 🔒 Authentication Flow

- **Login**: POST `/auth/login` → sets JWT cookie
- **Logout**: POST `/auth/logout` → clears cookie
- **Protected Routes**: Require a valid JWT cookie for access

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
│   │   ├── folder/
│   │   └── prisma/
└── README.md
```

---

## 🧠 Notes

- **Prisma ORM**: Simplifies database management with migrations and schema definitions
- **Validation**: Uses `class-validator` for backend input validation
- **Animations**: Powered by `Framer Motion` for smooth transitions
- **Error Monitoring**: Sentry integration for tracking and resolving issues

---

## 🔗 Links

- [Live Application](https://notes-web-app-tan.vercel.app/)
- [GitHub Repository](https://github.com/Hikko218/Notes-Web-App)
- [Project Board](https://github.com/Hikko218/Notes-Web-App/projects)
