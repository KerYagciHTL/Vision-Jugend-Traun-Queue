const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

const filePath = "./queue.json";

app.get("/queue", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Fehler beim Lesen der Datei" });
    }
    res.json(JSON.parse(data));
  });
});

app.post("/queue", (req, res) => {
  const newUser = req.body;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Fehler beim Lesen der Datei" });
    }

    const jsonData = JSON.parse(data);
    jsonData.queue.push(newUser);

    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), "utf8", (err) => {
      if (err) {
        return res.status(500).json({ error: "Fehler beim Schreiben der Datei" });
      }
      res.status(200).json({ message: "Benutzer hinzugefügt", user: newUser });
    });
  });
});

app.post("/queue/next", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Fehler beim Lesen der Datei" });
    }

    const jsonData = JSON.parse(data);
    if (jsonData.queue.length === 0) {
      return res.status(400).json({ error: "Die Warteschlange ist leer" });
    }

    const nextUser = jsonData.queue.shift();

    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), "utf8", (err) => {
      if (err) {
        return res.status(500).json({ error: "Fehler beim Schreiben der Datei" });
      }
      res.status(200).json({ message: "Nächster Benutzer entfernt", user: nextUser });
    });
  });
});

app.post("/queue.json", (req, res) => {
  const { action } = req.body;

  if (action === "next") {
      const queue = JSON.parse(fs.readFileSync("queue.json", "utf8"));
      if (queue.length > 0) {
          queue.shift();
          fs.writeFileSync("queue.json", JSON.stringify(queue, null, 2));
          res.status(200).send({ success: true });
      } else {
          res.status(400).send({ success: false, message: "Keine Benutzer in der Warteschlange." });
      }
  } else {
      res.status(400).send({ success: false, message: "Ungültige Aktion." });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft unter http://localhost:${PORT}`);
});

app.use(express.static(__dirname));




