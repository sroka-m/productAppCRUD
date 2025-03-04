const express = require("express");
const path = require("node:path");
const methodOverride = require("method-override");
const app = express();
const mongoose = require("mongoose");
const Product = require("./models/product.js");
const Farm = require("./models/farm.js");
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

///////////Farm routes

app.get("/farms", async (req, res) => {
  try {
    let farms = await Farm.find({});
    res.render("farms/index", { farms });
  } catch (e) {
    console.log(e);
  }
});
app.get("/farms/new", (req, res) => {
  //new route must be before /products/:id otherwuse "new" will be treated as an id
  res.render("farms/new");
});
app.post("/farms", async (req, res) => {
  try {
    // res.send(req.body);
    let newFarm = new Farm(req.body);
    await newFarm.save();
    res.redirect(`/farms`);
  } catch (e) {
    console.log(e);
  }
});

app.get("/farms/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let farm = await Farm.findById(id).populate("products", "name _id");
    console.log(farm);
    res.render("farms/show", { farm });
  } catch (e) {
    console.log(e);
  }
});

//U

//D

///////////Prodcut routes
const categories = ["fruit", "vegetable", "dairy"];

app.get("/products", async (req, res) => {
  try {
    const { category } = req.query;
    if (category) {
      let products = await Product.find({ category }).populate("farm", "name");
      res.render("index", { products, category });
    } else {
      let products = await Product.find({}).populate("farm", "name");
      res.render("products/index", { products, category: "All" });
    }
  } catch (e) {
    console.log(e);
  }
});

//the option to create product was intially on the product index page, i will delete it for now, in the future we could make another new form where the farm field would be drop dowm menu, list of all the farms. We ould
//essentily loop through all farms crate li. It is much more computaional heavy solution that creating from the farm view and an overkill
//but just curious how to implemtn it
app.get("/products/new/farms/:id", async (req, res) => {
  //new route must be before /products/:id otherwuse "new" will be treated as an id
  let { id } = req.params;
  console.log(req.params);
  let { name, _id } = await Farm.findById(id);
  console.log(name);
  res.render("products/new", { categories, name, _id });
});
app.post("/products/farms/:id", async (req, res) => {
  try {
    //technically we ought to be doing form santizing, making sure there are stuff thatis not meant to be
    let { id } = req.params;
    let farm = await Farm.findById(id);
    let newProduct = new Product(req.body);
    newProduct.farm = farm;
    await newProduct.save();
    farm.products.push(newProduct);
    await farm.save();
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
    res.render("products/update", { product, categories });
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
    let product = await Product.findById(id).populate("farm", "name _id");
    console.log(product);
    res.render("products/show", { product });
  } catch (e) {
    console.log(e);
  }
});

app.listen(3000, (req, res) => {
  console.log("listening at 3000");
});
