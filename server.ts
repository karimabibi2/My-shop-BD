import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());
  app.use(cors());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/create-order", async (req, res) => {
    const { cart, userId, total } = req.body;
    // In a real app, you'd save to DB here
    res.json({ success: true, orderId: "ORD" + Date.now() });
  });

  app.post("/api/stripe-session", async (req, res) => {
    const { amount } = req.body;
    // Mock Stripe session for now
    res.json({ id: "cs_test_" + Date.now() });
  });

  app.post("/api/bkash-create", async (req, res) => {
    const { amount } = req.body;
    res.json({ success: true, paymentID: "BK" + Date.now(), bkashURL: "#" });
  });

  app.post("/api/ai-chat", async (req, res) => {
    const { message } = req.body;
    // This would call OpenAI/Gemini
    res.json({ reply: "I am your AI assistant. How can I help you with your order?" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
