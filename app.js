const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("article", articleSchema);
app.route("/articles")
  .get((req, res) => {
    Article.find({}, (err, foundArticles) => {
      if (!err) res.send(foundArticles);
      else res.send(err);
    });
  })
  .post((req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save((err) => {
      if (!err) res.send("Susccessfully added a new article.");
      else res.send(err);
    });
  })
  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      if (!err) res.send("successfully deleted all articles");
      else res.send(err);
    });
  });

 //////targeting the specific article
  app.route("/articles/:title")
  .get((req,res)=>{
        Article.findOne({title:req.params.title},(err,foundArticle)=>{
            if(foundArticle){
                res.send(foundArticle)
            } else {
                res.send("No articles found")
            }         
        })
  })
  .put((req,res)=>{
    Article.updateOne(
      {title : req.params.title},
      {title : req.body.title,content:req.body.content},
      (err) =>{
        if(!err)
        res.send("successfully updated the article")
        else
        console.log(err);
      }
      )
  })
  .patch((req,res)=>{
    Article.updateOne(
      {title:req.params.title},
      {$set : req.body},
      (err) =>{
        if(!err)
        res.send("successfully updated the article")
      }
    )
  })
  .delete((req,res)=>{
    Article.deleteOne(
      {title : req.body.title}, 
      err =>{
        if(!err)
        res.send("Successfully deleted the article")
      }
    )
  })


app.listen(3000, function () {
  console.log("Server starting on port 3000...");
});
