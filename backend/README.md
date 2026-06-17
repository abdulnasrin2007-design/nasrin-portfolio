# Portfolio Backend — Setup & Deployment Guide

## Folder Structure

```
portfolio/
├── index.html
├── style.css
├── script.js
├── favicon.svg
├── profile.jpg
└── backend/
    ├── server.js
    ├── package.json
    ├── .env.example
    ├── .gitignore
    └── README.md
```

---

## Local Development

### Step 1 — Install dependencies
```bash
cd backend
npm install
```

### Step 2 — Configure environment
```bash
cp .env.example .env
```
Open `.env` and fill in:
- `GMAIL_USER` — your Gmail address
- `GMAIL_PASS` — your Gmail App Password (see below)
- `FRONTEND_URL` — `http://127.0.0.1:5500` for local testing
- `PORT` — leave as `3000`

### Step 3 — Get a Gmail App Password
1. Go to **myaccount.google.com**
2. Security → **2-Step Verification** (must be enabled)
3. Security → **App passwords**
4. App: **Mail**, Device: **Other** → type "Portfolio"
5. Copy the 16-character password into `GMAIL_PASS`

### Step 4 — Run locally
```bash
npm run dev     # uses nodemon (auto-restarts on file change)
# or
npm start       # plain node
```
Server runs at **http://localhost:3000**

### Step 5 — Update frontend
In `script.js`, set:
```js
const BACKEND_URL = 'http://localhost:3000';
```

---

## Deploy to Render (free)

### Step 1 — Push backend to GitHub
Create a **separate** GitHub repo for the backend (or a subfolder):
```bash
cd backend
git init
git add .
git commit -m "Initial backend"
git remote add origin https://github.com/your-username/portfolio-backend
git push -u origin main
```

### Step 2 — Create Render Web Service
1. Go to **render.com** → New → Web Service
2. Connect your backend GitHub repo
3. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node

### Step 3 — Add Environment Variables on Render
In your Render service → **Environment** tab, add:
| Key | Value |
|-----|-------|
| `GMAIL_USER` | your-email@gmail.com |
| `GMAIL_PASS` | your 16-char app password |
| `FRONTEND_URL` | https://your-portfolio.vercel.app |

### Step 4 — Update frontend
Copy your Render URL (e.g. `https://portfolio-backend-xyz.onrender.com`)
and update `script.js`:
```js
const BACKEND_URL = 'https://portfolio-backend-xyz.onrender.com';
```
Redeploy your frontend on Vercel.

---

## API Reference

### POST /send-message

**Request body (JSON):**
```json
{
  "name": "Visitor Name",
  "email": "visitor@email.com",
  "purpose": "Collaboration",
  "message": "Hello, I wanted to reach out about..."
}
```

**Success (200):**
```json
{ "success": true, "message": "Message sent successfully." }
```

**Validation error (400):**
```json
{ "success": false, "error": "Valid email is required." }
```

**Server error (500):**
```json
{ "success": false, "error": "Failed to send email. Please try again." }
```

---

## Notes
- Each form submission sends **two emails**: one to you (the owner) and one auto-reply to the sender.
- The `.env` file must never be committed to Git (`.gitignore` handles this).
- Render's free tier spins down after inactivity — first request may take ~30 seconds to wake up.
