# GCB FEST - Student Event Management System

A full-stack event management platform that enables students to discover and register for events while allowing admins to manage events and registrations.

## Features

- Event Management: Create, update, and delete events
- Student Registration: Browse and register for events
- Admin Dashboard: Manage events, categories, and student registrations
- Email Notifications: Automated notifications using Nodemailer
- Mobile Responsive: Works perfectly on all devices

## Tech Stack

**Backend:** Node.js, Express, MongoDB, JWT, Nodemailer, Cloudinary

**Frontend:** React, Vite, Tailwind CSS, Axios, React Router

## Prerequisites

- Node.js & npm
- MongoDB
- Cloudinary account
- Email service credentials

## Deployment

Live Demo: [GCB Fest](https://gcb-fest-frontend.onrender.com)

The application is deployed on Render.

## Setup

### Clone the Repository

```bash
git clone https://github.com/junior1242/GCB-FEST.git
cd GCB-FEST
```

### Backend

```bash
cd BackendGCB
npm install
```

Add `.env` file in `BackendGCB` directory with required variables from `.env.example`:

```bash
npm start
```

Server runs on `http://localhost:5000`

### Frontend

```bash
cd GCB_FEST
npm install
npm run dev
```

App runs on `http://localhost:5173`

## Contributors

- Shahid Ali (Lead Developer)
- Muhammad Hussnain Javaid (Developer)
