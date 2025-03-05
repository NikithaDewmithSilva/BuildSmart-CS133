const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const app = express();
const port = 3000;

// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Middleware to parse JSON
app.use(express.json());

// Nodemailer Transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// API endpoint to send invite link
app.post("/invite-customer", async (req, res) => {
  const { email, project_id } = req.body;

  // Validate email
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  // Generate a unique invite token
  const inviteToken = uuidv4();
  const invite_link = `http://localhost:3000/invite/${inviteToken}`;

  // Create an invite record in the database
  const { data, error } = await supabase
    .from("invites")
    .insert([{ email, project_id, invite_token: inviteToken, invite_link, status: "pending" }]);

  if (error) {
    console.error("Supabase Error:", error);
    return res.status(500).json({ error: "Failed to create invite in database" });
  }

  // Send email to the customer
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "You're Invited to a Project",
    html: `
      <p>You've been invited to customize a BOQ for Project <strong>${project_id}</strong>.</p>
      <p>Click the link below to access:</p>
      <a href="${invite_link}" style="display: inline-block; padding: 10px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Join Project</a>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Invite sent successfully!" });
  } catch (err) {
    console.error("Email Error:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
