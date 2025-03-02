const express = require("express");
const path = require("node:path");
const methodOverride = require("method-override");
const app = express();
const mongoose = require("mongoose");
const Product = require("./models/product.js");
mongoose
  .connect("mongodb://127.0.0.1:27017/farmStand")
  .then(console.log("connection opened"))
  .catch((e) => {
    console.log(e);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const categories = ["fruit", "vegetable", "dairy"];

app.get("/products", async (req, res) => {
  try {
    const { category } = req.query;
    console.log(req.query);
    console.log(req.query == true);
    if (category) {
      let products = await Product.find({ category });
      res.render("index", { products, category });
    } else {
      let products = await Product.find({});
      res.render("index", { products, category: "All" });
    }
  } catch (e) {
    console.log(e);
  }
});

app.get("/products/new", (req, res) => {
  //new route must be before /products/:id otherwuse "new" will be treated as an id
  res.render("new", { categories });
});
app.post("/products", async (req, res) => {
  try {
    //technically we ought to be doing form santizing, making sure there are stuff thatis not meant to be
    let newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
  } catch (e) {
    console.log(e);
  }
});

app.get("/products/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let product = await Product.findById(id);
    console.log(product);
    res.render("update", { product, categories });
  } catch (e) {
    console.log(e);
  }
});
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(req.body);
    let product = await Product.findByIdAndDelete(id);
    // console.log(product);
    // res.redirect(`/products/`); this was cauing problems
    res.redirect(`/products`);
  } catch (e) {
    console.log(e);
  }
});
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(req.body);
    let product = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    // console.log(product);
    res.redirect(`/products/${product._id}`);
  } catch (e) {
    console.log(e);
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    console.log("hello");
    let product = await Product.findById(id);
    console.log(product);
    res.render("show", { product });
  } catch (e) {
    console.log(e);
  }
});

app.listen(3000, (req, res) => {
  console.log("listening at 3000");
});
