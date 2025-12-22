import express from "express";
import multer from "multer";
import { parseAndChunkPDF } from "../services/pdfParser.js";

const router = express.Router();

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Upload Route
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    console.log("📄 File received:", filePath);

    const chunks = await parseAndChunkPDF(filePath);

    res.status(200).json({
      message: "✅ PDF processed successfully",
      totalChunks: chunks.length,
      sample: chunks.slice(0, 3),
    });
  } catch (error) {
    console.error("❌ Error processing PDF:", error);
    res.status(500).json({ error: "Failed to process PDF" });
  }
});

export default router;
