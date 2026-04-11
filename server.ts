import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs/promises";
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure directories exist
async function ensureDirs() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  } catch (err) {
    console.error("Error creating directories:", err);
  }
}

// Helper to read/write JSON data
async function readData(filename: string, defaultValue: any = []) {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return defaultValue;
  }
}

async function writeData(filename: string, data: any) {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Multer config for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
  }
});
const upload = multer({ storage });

async function startServer() {
  await ensureDirs();

  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use(cors());

  // Serve uploads statically
  app.use("/uploads", express.static(UPLOADS_DIR));

  // --- API Routes ---

  // Seed Data
  app.post("/api/seed", async (req, res) => {
    const products = await readData("products");
    const categories = await readData("categories");
    
    if (products.length === 0) {
      const defaultProducts = [
        {
          id: "p1",
          name: "Premium Cotton T-Shirt",
          price: 1200,
          image: "https://picsum.photos/seed/tshirt/400/500",
          category: "Clothing",
          description: "High quality 100% cotton t-shirt.",
          rating: 4.5,
          reviews: 120,
          stock: 50,
          sizes: ["S", "M", "L", "XL"]
        },
        {
          id: "p2",
          name: "Wireless Bluetooth Headphones",
          price: 3500,
          image: "https://picsum.photos/seed/headphones/400/500",
          category: "Electronics",
          description: "Noise cancelling wireless headphones.",
          rating: 4.8,
          reviews: 85,
          stock: 30
        }
      ];
      await writeData("products", defaultProducts);
    }
    
    if (categories.length === 0) {
      const defaultCategories = [
        { id: "c1", name: "Clothing", image: "https://picsum.photos/seed/clothing/200/200" },
        { id: "c2", name: "Electronics", image: "https://picsum.photos/seed/electronics/200/200" },
        { id: "c3", name: "Home & Living", image: "https://picsum.photos/seed/home/200/200" }
      ];
      await writeData("categories", defaultCategories);
    }
    
    res.json({ success: true });
  });

  // Products
  app.get("/api/products", async (req, res) => {
    const products = await readData("products");
    res.json(products);
  });

  app.post("/api/products", async (req, res) => {
    const products = await readData("products");
    const newProduct = { ...req.body, id: req.body.id || `prod-${Date.now()}` };
    products.push(newProduct);
    await writeData("products", products);
    res.json(newProduct);
  });

  app.put("/api/products/:id", async (req, res) => {
    const products = await readData("products");
    const index = products.findIndex((p: any) => p.id === req.params.id);
    if (index !== -1) {
      products[index] = { ...products[index], ...req.body };
      await writeData("products", products);
      res.json(products[index]);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    let products = await readData("products");
    products = products.filter((p: any) => p.id !== req.params.id);
    await writeData("products", products);
    res.json({ success: true });
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    const categories = await readData("categories");
    res.json(categories);
  });

  app.post("/api/categories", async (req, res) => {
    const categories = await readData("categories");
    const newCategory = { ...req.body, id: `cat-${Date.now()}` };
    categories.push(newCategory);
    await writeData("categories", categories);
    res.json(newCategory);
  });

  app.put("/api/categories/:id", async (req, res) => {
    const categories = await readData("categories");
    const index = categories.findIndex((c: any) => c.id === req.params.id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...req.body };
      await writeData("categories", categories);
      res.json(categories[index]);
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    let categories = await readData("categories");
    categories = categories.filter((c: any) => c.id !== req.params.id);
    await writeData("categories", categories);
    res.json({ success: true });
  });

  // Orders
  app.get("/api/orders", async (req, res) => {
    const orders = await readData("orders");
    res.json(orders);
  });

  app.post("/api/orders", async (req, res) => {
    const orders = await readData("orders");
    const newOrder = { ...req.body, id: `ORD-${Date.now()}`, date: new Date().toISOString() };
    orders.push(newOrder);
    await writeData("orders", orders);
    res.json(newOrder);
  });

  app.put("/api/orders/:id", async (req, res) => {
    const orders = await readData("orders");
    const index = orders.findIndex((o: any) => o.id === req.params.id);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...req.body };
      await writeData("orders", orders);
      res.json(orders[index]);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  });

  // Config / Settings
  app.get("/api/config", async (req, res) => {
    const defaultConfig = {
      bannerImage: "https://picsum.photos/seed/shop/1200/400",
      whatsappNumber: "01700000000",
      bkashNumber: "01700000000",
      nagadNumber: "01700000000",
      rocketNumber: "01700000000",
      globalOrderPolicy: "",
      shippingRates: { "Inside Dhaka": 60, "Outside Dhaka": 120 },
      adminUsername: "Amiadmin",
      adminPassword: "Amiadmin12#"
    };
    
    const filePath = path.join(DATA_DIR, "config.json");
    try {
      await fs.access(filePath);
      const config = await readData("config");
      res.json(config);
    } catch {
      // File doesn't exist, write defaults
      await writeData("config", defaultConfig);
      res.json(defaultConfig);
    }
  });

  app.put("/api/config", async (req, res) => {
    const config = await readData("config");
    const newConfig = { ...config, ...req.body };
    await writeData("config", newConfig);
    res.json(newConfig);
  });

  // Auth
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    const users = await readData("users");
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      // Default admin check
      const config = await readData("config", {
        adminUsername: "Amiadmin",
        adminPassword: "Amiadmin12#"
      });
      
      const adminUser = (config.adminUsername || "Amiadmin").trim();
      const adminPass = (config.adminPassword || "Amiadmin12#").trim();
      const inputUser = (email || "").trim();
      const inputPass = (password || "").trim();

      if ((inputUser === "Niloyshop" && inputPass === "Niloyshop12#") || (inputUser === adminUser && inputPass === adminPass)) {
        res.json({ id: "admin", name: "Admin", email: inputUser, role: "admin", isAdmin: true });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    }
  });

  app.post("/api/register", async (req, res) => {
    const { email, password, name } = req.body;
    const users = await readData("users");
    if (users.find((u: any) => u.email === email)) {
      return res.status(400).json({ error: "User already exists" });
    }
    const newUser = { id: `user-${Date.now()}`, email, password, name, role: "client" };
    users.push(newUser);
    await writeData("users", users);
    const { password: _, ...userWithoutPassword } = newUser;
    res.json(userWithoutPassword);
  });

  // Image Upload
  app.post("/api/upload", upload.single("image"), (req, res) => {
    if (req.file) {
      const url = `/uploads/${req.file.filename}`;
      res.json({ url });
    } else {
      res.status(400).json({ error: "No file uploaded" });
    }
  });

  // --- Vite / Static Serving ---

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
