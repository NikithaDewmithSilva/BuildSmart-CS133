const express = require("express");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const router = express.Router();

// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// filepath: /c:/Users/Seni/Desktop/BuildSmart-CS133/backend/cadServer.js
router.post("/upload-cad", upload.single("cadFile"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });

  const { originalname, mimetype, buffer } = req.file;
  const { user_id, project_id } = req.body;
  const cad_id = uuidv4();
  const file_path = `cad_files/${cad_id}_${originalname}`;

  // Upload file to Supabase Storage
  const { data, error } = await supabase.storage.from("cad-files").upload(file_path, buffer, {
    contentType: mimetype,
  });

  if (error) {
    console.error("Supabase Storage upload error:", error);
    return res.status(500).json({ error: "Failed to upload file." });
  }

  // Save file info in the database
  const { error: dbError } = await supabase.from("cad_files").insert([
    { cad_id, file_name: originalname, file_path, file_type: mimetype, user_id, project_id },
  ]);

  if (dbError) {
    console.error("Supabase Database insert error:", dbError);
    return res.status(500).json({ error: "Failed to save file info." });
  }

  res.json({ message: "File uploaded successfully!", file_path });
});

/*
// Route to upload a CAD file
router.post("/upload-cad", upload.single("cadFile"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });

  const { originalname, mimetype, buffer } = req.file;
  const { user_id, project_id } = req.body;
  const cad_id = uuidv4();
  const file_path = `cad_files/${cad_id}_${originalname}`;

  // Upload file to Supabase Storage
  const { data, error } = await supabase.storage.from("cad-files").upload(file_path, buffer, {
    contentType: mimetype,
  });

  if (error) return res.status(500).json({ error: "Failed to upload file." });

  // Save file info in the database
  const { error: dbError } = await supabase.from("cad_files").insert([
    { cad_id, file_name: originalname, file_path, file_type: mimetype, user_id, project_id },
  ]);

  if (dbError) return res.status(500).json({ error: "Failed to save file info." });

  res.json({ message: "File uploaded successfully!", file_path });
});
*/
module.exports = router;