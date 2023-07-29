//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
const _= require("lodash");


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero."; 

const app = express();
// let postArr=[];
mongoose.connect("mongodb+srv://vishalvaishnav2677:7mw2Gh5TIbmEx3zi@cluster0.al73qhw.mongodb.net/blogDB?retryWrites=true&w=majority",{useNewUrlParser:true});
const postSchema={
  title:String,
  contant:String
}

const post=mongoose.model("post",postSchema);
const post1= new post({
  title:"Welcome to your Blog Website!",
  contant:"Url in /compose to crete your Daily Blog than submit"
});
// const post2= new Item({
//   name:"Hit the + button to add a new item."
// });
// const post3= new Item({
//   name:"<-- Hit this to delete an itme."
// });
const defaultItems=[post1];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  // res.render("home",{
  //   HomeContent:homeStartingContent,
  //   mypostArr:postArr,
  //   BodyMaxLength:100
  // });

  post.find({}).then(function(foundPosts){
    if(foundPosts.length === 0){
        post.insertMany(defaultItems).catch(function(err){
            console.log(err);
        })
        .then(function(){
            console.log("Successsfully Saved default itmes to database!");
        });
        res.redirect("/");
    }
    else{
        // res.render("list",{ListTitle:"Today",newListItem:foundItems});
        res.render("home",{
          // HomeContent:foundPosts.title,
          mypostArr:foundPosts,
          BodyMaxLength:100
        });
    }
})

.catch(function(err){
    console.log(err);
})

});

app.get("/contact",function(req,res){
  res.render("contact",{ContactContent:contactContent});
});
app.get("/about",function(req,res){
  res.render("about",{AboutContent:aboutContent});
});
app.get("/compose",function(req,res){
  res.render("compose");
});

app.get("/posts/:postName",function(req,res){
  // console.log(req.params.postName);

  // normal for loop
  // for(var i=0;i<postArr.length;i++){
  //   if((req.params.postName)===postArr[i].Title){
  //     console.log("Title is found!");
  //   }
  // }
  // for Each for loop
  const requestedpost=_.capitalize(req.params.postName);
  // post.forEach(function(element){
  //   const myArrTitle=_.lowerCase(element.title);
  //   if((requestedpost)===myArrTitle){
  //     console.log("Title is found!");
      // res.render("post",{reqTitle:element.title,
      //   reqBody:element.contant,
      // });
  //   }
  // })
  console.log(requestedpost);
  post.findOne({title:requestedpost}, null, { maxTimeMS: 20000 }).then(function(foundPost){
    res.render("post",{reqTitle:foundPost.title,
      reqBody:foundPost.contant,
    });
  })
  .catch(function(err){
    console.log("Can not found");
    console.log(err);
  })
});

app.post("/compose",function(req,res){
  // console.log(req.body.postTitle);
  // console.log(req.body.postBody);
  const mypost={
    title:req.body.postTitle,
    contant:req.body.postBody
  };
  post.insertMany(mypost).catch(function(err){
    console.log(err);
  })
  .then(function(){
    console.log("Successsfully Saved default itmes to database!");
  });
  res.redirect("/");
});
app.post("/formdata",function(req,res){
  const searchTitle=req.body.searchname;
  // console.log("Enter formdata");
  // console.log(searchTitle);
  res.redirect("/posts/"+searchTitle);
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
