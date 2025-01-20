const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

const filePath = "./queue.json";

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname));

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
    let newId = jsonData.lastId + 1;
    if (newId > 100) {
      newId = 1;
    }
    newUser.id = newId;
    
    jsonData.queue.push(newUser);
    jsonData.lastId = newId;

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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server läuft unter http://185.128.246.66:${PORT}`);
});

