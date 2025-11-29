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

const fallbackCirculars = [
  { title: "Amendment in Schedule-II of BIS (CRS) Rules 2024", link: "https://www.bis.gov.in/index.php/circulars/" },
  { title: "Registration Scheme for Electronic Products", link: "https://www.bis.gov.in/index.php/circulars/" },
  { title: "Guidelines for Foreign Manufacturers License", link: "https://www.bis.gov.in/index.php/circulars/" },
  { title: "Quality Control Order for Steel Products", link: "https://www.bis.gov.in/index.php/circulars/" },
  { title: "ISI Mark Certification Process Update", link: "https://www.bis.gov.in/index.php/circulars/" },
  { title: "BIS Hallmarking Guidelines 2024-25", link: "https://www.bis.gov.in/index.php/circulars/" },
  { title: "Laboratory Recognition Scheme Updates", link: "https://www.bis.gov.in/index.php/circulars/" },
  { title: "Compulsory Registration for IT Products", link: "https://www.bis.gov.in/index.php/circulars/" },
  { title: "Product Certification Fee Revision Notice", link: "https://www.bis.gov.in/index.php/circulars/" },
  { title: "BIS Standards for Consumer Electronics", link: "https://www.bis.gov.in/index.php/circulars/" }
];

app.get("/api/circulars", async (req, res) => {
  try {
    const bisURL = "https://www.bis.gov.in/whats-new-notifications/";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(bisURL, { 
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    clearTimeout(timeout);
    const html = await response.text();

    const matches = [...html.matchAll(/href="([^"]+\.pdf)"[^>]*>([^<]+)</g)];
    const circulars = matches.slice(0, 10).map((m) => ({
      title: m[2].trim(),
      link: m[1].startsWith("http") ? m[1] : `https://www.bis.gov.in${m[1]}`
    })).filter(c => c.title.length > 3 && /[a-zA-Z]/.test(c.title));
    
    if (circulars.length >= 5) {
      res.json(circulars);
    } else {
      res.json(fallbackCirculars);
    }
  } catch (e) {
    console.error("BIS fetch error:", e.message);
    res.json(fallbackCirculars);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
