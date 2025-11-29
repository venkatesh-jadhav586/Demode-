// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
