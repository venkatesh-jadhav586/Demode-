// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.static(__dirname));

app.get("/api/circulars", async (req, res) => {
  try {
    const bisURL = "https://www.bis.gov.in/index.php/circulars/";
    const response = await fetch(bisURL);
    const html = await response.text();

    const matches = [...html.matchAll(/href="([^"]+\.pdf)"[^>]*>(.*?)<\/a>/g)];
    const circulars = matches.slice(0, 10).map((m, i) => ({
      title: m[2].replace(/<[^>]+>/g, "").trim(),
      link: m[1].startsWith("http") ? m[1] : `https://www.bis.gov.in/${m[1]}`
    }));
    res.json(circulars);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Unable to load circulars" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
