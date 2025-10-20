# Expense Tracker Backend (KonnichiWow) - Ehtishaam

This repository contains the backend for an Expense Tracker application built with Node.js, Express, MongoDB (Mongoose) and Firebase Authentication. It includes CRUD endpoints, custom middleware for authentication and errors, input validation, and aggregated reporting.

## 🚀 Project Overview
The API provides:
- User management (registration / login) via Firebase
- Expense management (create, read, update, delete) scoped to the logged-in user's Firebase UID

## ⚙️ Setup and Installation

### 1. Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Firebase project with Email/Password authentication enabled

### 2. Installation
```bash
git clone <your-repository-url>
cd ExpenseTrackerBackend_Ehtishaam
npm install
```

### 3. Environment Variables
Create a `.env` file in the project root and set the following variables:

```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/expense_db
SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

### 4. Firebase Service Account
Download your Firebase service account JSON and save it in the project root as `serviceAccountKey.json`. This file is listed in `.gitignore` and must not be committed.

## ▶️ How to Run the Server
```bash
# development (nodemon)
npm run dev

# production
npm start
```

The API will be accessible at: `http://localhost:5000/api`

## 📌 Authentication
All expense and report endpoints require a valid Firebase ID Token sent in the request header:

```
Authorization: Bearer <token>
```

## 📌 Example API Usage

1. Register
- Method: `POST`
- Endpoint: `/api/register`
- Body:
```json
{ "email": "user@test.com", "password": "pass" }
```

2. Add Expense
- Method: `POST`
- Endpoint: `/api/expenses`
- Body:
```json
{
  "title": "Dinner",
  "amount": 35,
  "category": "Food",
  "date": "2025-10-20"
}
```

Refer to `postman_collection.json` for full testing examples.
