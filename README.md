# Abdul Nasrin — Portfolio

Premium glassmorphism personal portfolio with a Node.js + Nodemailer backend for the contact form.

---

## Folder Structure

```
portfolio/
├── index.html          ← Main portfolio page
├── style.css           ← All styles
├── script.js           ← Frontend logic
├── profile.jpg         ← Your profile photo
├── favicon.svg         ← Site favicon
└── backend/
    ├── server.js       ← Express + Nodemailer server
    ├── package.json    ← Backend dependencies
    ├── .env.example    ← Environment variable template
    └── .gitignore
```

---

## 1 — Backend Setup (Local)

### Prerequisites
- Node.js v18 or higher — https://nodejs.org

### Install

```bash
cd backend
npm install
```

### Configure Environment

```bash
cp .env.example .env
```

Open `.env` and fill in:

```
GMAIL_USER=abdulnasrin2007@gmail.com
GMAIL_PASS=your_16_char_app_password_here
FRONTEND_URL=http://127.0.0.1:5500
PORT=3001
```

**How to get a Gmail App Password:**
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → Enable **2-Step Verification**
3. Security → **App passwords**
4. Select "Mail" → Generate → Copy the 16-character password
5. Paste it as `GMAIL_PASS` in your `.env`

### Run Locally

```bash
npm run dev     # with nodemon (auto-restart on change)
# or
npm start       # plain node
```

Backend will be available at `http://localhost:3001`

---

## 2 — Frontend Setup (Local)

Open `index.html` with [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code, or any local server.

In `script.js`, update:

```js
const BACKEND_URL = 'http://localhost:3001/send-message';
```

---

## 3 — Deploy Backend to Render (Free)

1. Push the `backend/` folder to a **separate GitHub repository**
   (e.g. `portfolio-backend`)

2. Go to [render.com](https://render.com) → **New → Web Service**

3. Connect your `portfolio-backend` repo

4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** Node

5. Add Environment Variables in Render dashboard:
   ```
   GMAIL_USER   = abdulnasrin2007@gmail.com
   GMAIL_PASS   = your_app_password
   FRONTEND_URL = https://your-portfolio.vercel.app
   ```

6. Deploy → Copy the URL (e.g. `https://portfolio-backend-xxxx.onrender.com`)

7. In `script.js`, update:
   ```js
   const BACKEND_URL = 'https://portfolio-backend-xxxx.onrender.com/send-message';
   ```

---

## 4 — Deploy Frontend to Vercel

1. Push the root `portfolio/` folder (without `backend/`) to GitHub

2. Go to [vercel.com](https://vercel.com) → **New Project**

3. Import your repo

4. Settings:
   - **Framework Preset:** Other
   - **Root Directory:** `./` (or wherever `index.html` is)

5. Deploy → Your portfolio is live!

---

## 5 — Test the Contact Form

1. Visit your live site
2. Fill the contact form with all fields + correct math answer
3. Submit
4. Check `abdulnasrin2007@gmail.com` — you should receive the email

If it doesn't arrive, check:
- Gmail App Password is correct (not regular password)
- `GMAIL_USER` matches the account you created the App Password for
- Render logs for any errors

---

## Quick Reference

| What                  | Where                                 |
|-----------------------|---------------------------------------|
| Backend endpoint      | `POST /send-message`                 |
| Health check          | `GET /health`                         |
| Change backend URL    | `script.js` → `BACKEND_URL`          |
| Gmail credentials     | `backend/.env`                        |
| CORS origin           | `backend/.env` → `FRONTEND_URL`      |

---

© 2026 Abdul Nasrin • Portfolio
