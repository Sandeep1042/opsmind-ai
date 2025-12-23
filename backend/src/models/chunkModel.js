import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
  text: { type: String, required: true },
  embedding: { type: [Number], required: true },
  source: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Chunk = mongoose.model("Chunk", chunkSchema);
