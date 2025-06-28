const express = require('express');
const app =express();
const path = require('path');

const fs = require('fs');

app.set("view engine" , "ejs");
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use(express.static(path.join(__dirname,"public")));

app.get("/",function (req,res) {
    fs.readdir(`./files`,function (err,files) {
        res.render("index",{files:files});  
    });
     
});

app.get("/file/:filename",function (req,res) {
    fs.readFile(`./files/${req.params.filename}`, "utf-8",function (err,filedata) {
        res.render('show',{filename:req.params.filename , filedata:filedata});
    });
     
});

app.get("/edit/:filename",function (req,res) {
    res.render('edit',{filename:req.params.filename });
});


app.post('/edit',function (req,res) {
    fs.rename(`./files/${req.body.previous}`,`./files/${req.body.new.split(' ').join("_")}.txt`,function (err) {
        res.redirect("/")
    });
});

app.post("/create",function (req,res) {
fs.writeFile(`./files/${req.body.title.split(' ').join("_")}.txt`,req.body.details,function (err) {
    res.redirect("/")
});

});

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


app.listen(3000);
