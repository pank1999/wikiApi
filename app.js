const bodyParser = require("body-parser");
const express=require("express");
const ejs=require('ejs');
const mongoose=require("mongoose");
const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});

const articleSchema={
    title:String,
    content:String
}

const Article=mongoose.model("Artical",articleSchema);


//chained routing 
app.route("/articles").get(function(req,res){
    Article.find(function(err,foundArticles){
        if(!err){
            res.send(foundArticles);
        }   

    });
}).post(function(req,res){
    console.log(req.body.title);
    const newArticle=new  Article({
        title:req.body.title,
        content:req.body.content
    });

    newArticle.save(function(err){
        if(!err){
            res.send("successfully added new article");
        }
        else{
            res.send(err);
        }
    });
}).delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("successfully deleted all articles");
        }
        else{
            res.send(err);
        }
    });
});

//targetting a specific article
app.route("/articles/:articleTitle").get(function(req,res){
    Article.findOne({title:req.params.articleTitle},function(err,foundArticles){
        if(foundArticles){
            res.send(foundArticles);
        }
        else{
            res.send("article not found!");
        }
    });
}).put(function(req,res){
    Article.updateOne(
        {title:req.params.articleTitle},
        {title:req.body.title,content:req.body.content},
        {overwrite:True},
        function(err){
             if(!err){
                 res.send("successfully updated the article");
             }
             else{
                 res.send(err);
             }
        }

    );
}).patch(function(req,res){
    Article.updateOne(
        {title:req.params.articleTitle},
        {$set:req.body},
        function(err){
            if(!err){
                res.send("successfully updated the specific article");
            }
            else{
                res.send(err);
            }
        }
    )
}).delete(function(req,res){
    Article.deleteOne(
        {title:req.params.articleTitle},
        function(err){
            if(!err){
                res.send("successfully deleted the specific articles");
            }
            else{
                res.send(err);
            }
        }
    );
});


app.listen(3000,function(){
    console.log("server has started running on port 3000");
})

