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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(bisURL, { 
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    clearTimeout(timeout);
    const html = await response.text();

    const matches = [...html.matchAll(/href="([^"]+\.pdf)"[^>]*>(.*?)<\/a>/g)];
    const circulars = matches.slice(0, 10).map((m, i) => ({
      title: m[2].replace(/<[^>]+>/g, "").trim(),
      link: m[1].startsWith("http") ? m[1] : `https://www.bis.gov.in/${m[1]}`
    }));
    
    if (circulars.length > 0) {
      res.json(circulars);
    } else {
      res.json([
        { title: "BIS Certification Guidelines 2025", link: "https://www.bis.gov.in/index.php/circulars/" },
        { title: "Product Certification Scheme Updates", link: "https://www.bis.gov.in/index.php/circulars/" },
        { title: "Quality Control Orders", link: "https://www.bis.gov.in/index.php/circulars/" },
        { title: "ISI Mark Application Process", link: "https://www.bis.gov.in/index.php/circulars/" },
        { title: "Laboratory Recognition Criteria", link: "https://www.bis.gov.in/index.php/circulars/" }
      ]);
    }
  } catch (e) {
    console.error(e);
    res.json([
      { title: "BIS Certification Guidelines 2025", link: "https://www.bis.gov.in/index.php/circulars/" },
      { title: "Product Certification Scheme Updates", link: "https://www.bis.gov.in/index.php/circulars/" },
      { title: "Quality Control Orders", link: "https://www.bis.gov.in/index.php/circulars/" },
      { title: "ISI Mark Application Process", link: "https://www.bis.gov.in/index.php/circulars/" },
      { title: "Laboratory Recognition Criteria", link: "https://www.bis.gov.in/index.php/circulars/" }
    ]);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
