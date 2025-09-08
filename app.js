//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


mongoose
  .connect(
    "mongodb+srv://Fifonsi:iHw9ozYCvaXmCNKy@cluster0.o5mlfps.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("DB connected!");
  })
  .catch((err) => console.log(err));

const postSchema = {
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
};

const Post = mongoose.model("Post", postSchema);

const homeStartingContent =
  "Welcome to Daily Journal! Capture your thoughts, ideas, and memories every day. Our platform makes it easy to write, organize, and revisit your personal stories. Start journaling today and see how your journey unfolds!";
const aboutContent =
  "Daily Journal was created to help people reflect, grow, and stay organized.I believe that writing regularly can improve your well-being and help you achieve your goals. My mission is to provide a simple, beautiful space for your daily reflections.";
const contactContent =
  "Have questions or feedback? I'd love to hear from you! Reach out anytime and I will get back to you as soon as possible (donaldfifonsi@gmail.com). Your thoughts help us improve Daily Journal for everyone.";




app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  Post.find({}).then((posts) => {
    res.render("home", { constant: homeStartingContent, post: posts });
  });
});

app.get("/about", function (req, res) {
  res.render("about", { about: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contact: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const title = req.body.postTitle;
  const body = req.body.postBody;

  const dynamicPost = new Post({
    title: title,
    content: body,
  });
  dynamicPost.save();

  res.redirect("/");
});
app.post("/delete/:postId", function (req, res) {
  const postId = req.params.postId;
  Post.findByIdAndDelete(postId)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
});

app.get("/posts/:postId", function (req, res) {
  const urlPost = _.lowerCase(req.params.newPostNum);
  const postId = req.params.postId;

  // posts.forEach(function (post) {
  //   const postTitle = _.lowerCase(post.title);
  //   if (urlPost === postTitle) {
  //     console.log("matching! 8)");
  //     res.render("post", {
  //       title: posts.title,
  //       body: posts.content,
  //       urlPost:urlPost,
  //     });
  Post.findById(postId).then((post) => {
    if (post) {
      res.render("post", {
        title: post.title,
        body: post.content,
        postId: postId,
      });
    } else {
      res.redirect("/");
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
