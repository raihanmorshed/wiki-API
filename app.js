const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser:true});

//creating schema
const articleSchema = {
    title: String,
    content: String
};

//creating model
const Article = mongoose.model("Article", articleSchema);

//API
//Express route chanining
//requests targeting ALL articles
// app.route("/articles").get().post().delete();
app.route("/articles")
    .get((req, res) => {
        Article.find(function(err, foundArticles){
            if(!err){
                res.send(foundArticles);
            } else {
                res.send(err);
            }
            
        });
    })
    .post((req,res) => {
        console.log();
        console.log();
    
        //CREATE in mongoose
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
    
        newArticle.save(function(err){
            if(err){
            res.send("Successfully added a new article");
            } else {
                res.send(err);
            }
        });
    })
    .delete((req,res) => {
        Article.deleteMany(function(err){
            if(!err){
                res.send("Successfully deleted all articles");
            } else {
                res.send(err);
            };
        });
    });


//GET
// app.get("/articles", (req, res) => {
//     Article.find(function(err, foundArticles){
//         if(!err){
//             res.send(foundArticles);
//         } else {
//             res.send(err);
//         }
        
//     });
// });

//POST
// app.post("/articles", (req,res) => {
//     console.log();
//     console.log();

//     //CREATE in mongoose
//     const newArticle = new Article({
//         title: req.body.title,
//         content: req.body.content
//     });

//     newArticle.save(function(err){
//         if(err){
//         res.send("Successfully added a new article");
//         } else {
//             res.send(err);
//         }
//     });
// });

//DELETE
// app.delete("/articles", (req,res) => {
//     Article.deleteMany(function(err){
//         if(!err){
//             res.send("Successfully deleted all articles");
//         } else {
//             res.send(err);
//         };
//     });
// });


//requests targeting a specific article
app.route("/articles/:articleTitle")
    .get((req,res) => {
        Article.findOne({title:req.params.articleTitle}, function(err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No matching article was found.");
            }
        });
})
.put((req,res) => {
    Article.updateOne(
        {title:req.params.articleTitle},
        {title:req.body.title, content:req.body.content},
        {overwrite:true}, 
        function(err){
            if(!err) {
                res.send("Successfully updated the article");
            }
        }
        );
    })
.patch((req,res) => {
    Article.updateOne(
        {title:req.params.articleTitle},
        {$set: req.body},
        function(err) {
            if(!err){
                res.send("Successfully updated the article.");
            } else {
                res.send(err);
            }
        }
    );
})
.delete((req,res) => {
    Article.deleteOne(
        {title:req.params.articleTitle},
        function(err) {
            if(!err) {
                res.send("Successfully deleted the article.");
            } else {
                re.send(err);
            }
        }
    );
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});