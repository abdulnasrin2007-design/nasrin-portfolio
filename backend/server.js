const express    = require('express');
const cors       = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app  = express();

// ── Middleware ──────────────────────────────────────────
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['POST', 'GET'],
}));

// ── Nodemailer transporter ──────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── POST /api/send-message ──────────────────────────────
app.post('/api/send-message', async (req, res) => {
  const { name, email, purpose, message } = req.body;

  if (!name || !email || !purpose || !message)
    return res.status(400).json({ error: 'All fields are required.' });

  if (!isValidEmail(email))
    return res.status(400).json({ error: 'Invalid email address.' });

  if (name.trim().length < 2 || name.trim().length > 80)
    return res.status(400).json({ error: 'Name must be 2-80 characters.' });

  if (message.trim().length < 10 || message.trim().length > 500)
    return res.status(400).json({ error: 'Message must be 10-500 characters.' });

  const mailOptions = {
    from:    `"${name.trim()}" <${process.env.EMAIL_USER}>`,
    to:      process.env.EMAIL_USER,
    replyTo: email.trim(),
    subject: `Portfolio Contact | ${purpose} — from ${name.trim()}`,
    text: `Name: ${name.trim()}\nEmail: ${email.trim()}\nPurpose: ${purpose}\n\nMessage:\n${message.trim()}`,
    html: `
<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#06080f;color:#e8eaf2;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.08)">
  <div style="background:linear-gradient(135deg,#0b0f1a,#0d1220);padding:28px 32px;border-bottom:1px solid rgba(79,142,247,0.2)">
    <h2 style="margin:0;color:#4f8ef7;font-size:1.3rem">Portfolio Contact Form</h2>
    <p style="margin:6px 0 0;color:#7a849a;font-size:0.85rem">New message received</p>
  </div>
  <div style="padding:32px">
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:8px 0;color:#7a849a;font-size:0.85rem;width:90px">Name</td>
          <td style="padding:8px 0;color:#e8eaf2;font-weight:600">${name.trim()}</td></tr>
      <tr><td style="padding:8px 0;color:#7a849a;font-size:0.85rem">Email</td>
          <td style="padding:8px 0"><a href="mailto:${email.trim()}" style="color:#7eb8ff;text-decoration:none">${email.trim()}</a></td></tr>
      <tr><td style="padding:8px 0;color:#7a849a;font-size:0.85rem">Purpose</td>
          <td style="padding:8px 0;color:#e8eaf2">${purpose}</td></tr>
    </table>
    <div style="margin-top:24px;padding:16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:8px">
      <p style="margin:0 0 8px;color:#7a849a;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.08em">Message</p>
      <p style="margin:0;color:#e8eaf2;line-height:1.7">${message.trim().replace(/\n/g, '<br>')}</p>
    </div>
  </div>
  <div style="padding:16px 32px;background:rgba(0,0,0,0.2);border-top:1px solid rgba(255,255,255,0.05);font-size:0.78rem;color:#7a849a;text-align:center">
    Abdul Nasrin Portfolio Contact
  </div>
</div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Mail error:', err.message);
    return res.status(500).json({ error: 'Failed to send. Please try again.' });
  }
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

module.exports = app;