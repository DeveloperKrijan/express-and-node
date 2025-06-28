const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Ensure the "files" folder exists at startup
const filesDir = path.join(__dirname, 'files');
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir);
}

// Set view engine and middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Home route: list files
app.get("/", function (req, res) {
  fs.readdir('./files', function (err, files) {
    if (err) {
      console.error("Error reading files directory:", err.message);
      return res.render("index", { files: [] });
    }
    res.render("index", { files: files });
  });
});

// View individual file
app.get("/file/:filename", function (req, res) {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, filedata) {
    if (err) {
      return res.status(404).send("File not found");
    }
    res.render('show', { filename: req.params.filename, filedata: filedata });
  });
});

// Edit filename form
app.get("/edit/:filename", function (req, res) {
  res.render('edit', { filename: req.params.filename });
});

// Handle filename edit
app.post('/edit', function (req, res) {
  const oldName = `./files/${req.body.previous}`;
  const newName = `./files/${req.body.new.split(' ').join("_")}.txt`;

  fs.rename(oldName, newName, function (err) {
    if (err) {
      console.error("Rename failed:", err.message);
    }
    res.redirect("/");
  });
});

// Create new file
app.post("/create", function (req, res) {
  const filename = `${req.body.title.split(' ').join("_")}.txt`;
  const content = req.body.details;

  fs.writeFile(`./files/${filename}`, content, function (err) {
    if (err) {
      console.error("File creation failed:", err.message);
    }
    res.redirect("/");
  });
});

// Delete file
app.post("/delete", (req, res) => {
  const filename = req.body.title;
  const filepath = path.join(__dirname, "files", filename);

  fs.unlink(filepath, (err) => {
    if (err) {
      console.error("File delete failed:", err.message);
    }
    res.redirect("/");
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
