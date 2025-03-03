const express = require("express");
const path = require("node:path");
const methodOverride = require("method-override");
const AppError = require("./AppError.js");
const app = express();
const mongoose = require("mongoose");
const Product = require("./models/product.js");
mongoose
  .connect("mongodb://127.0.0.1:27017/farmStand2")
  .then(console.log("connection opened"))
  .catch((e) => {
    console.log(e);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const categories = ["fruit", "vegetable", "dairy"];

//i can go this because async return a promise
function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => next(e));
  };
}

app.get(
  "/products",
  wrapAsync(async (req, res, next) => {
    const { category } = req.query;
    // console.log(req.query);
    // console.log(req.query == true);
    if (category) {
      let products = await Product.find({ category });
      res.render("index", { products, category });
    } else {
      let products = await Product.find({});
      res.render("index", { products, category: "All" });
    }
  })
);

app.get("/products/new", (req, res) => {
  //new route must be before /products/:id otherwuse "new" will be treated as an id
  res.render("new", { categories });
});
app.post("/products", async (req, res, next) => {
  try {
    //technically we ought to be doing form santizing, making sure there are stuff thatis not meant to be
    let newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
  } catch (e) {
    next(e);
  }
});

app.get(
  "/products/update/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    let product = await Product.findById(id);
    if (!product) {
      throw new AppError(404, "Product not found");
    }
    // console.log(product);
    res.render("update", { product, categories });
  })
);
app.delete(
  "/products/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    // console.log(req.body);
    let product = await Product.findByIdAndDelete(id);
    // console.log(product);
    // res.redirect(`/products/`); this was cauing problems
    res.redirect(`/products`);
  })
);
app.put(
  "/products/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    // console.log(req.body);
    let product = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    // console.log(product);
    res.redirect(`/products/${product._id}`);
  })
);

app.get(
  "/products/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    // console.log(id);
    let product = await Product.findById(id);
    if (!product) {
      throw new AppError(404, "Product not found");
    }
    // console.log(product);
    res.render("show", { product });
  })
);

const valideteErr = (err) => {
  console.dir(err);
  return new AppError(400, `invalid input ${err.message}`);
};

app.use((err, req, res, next) => {
  console.log(err.name);
  if (err.name === "ValidationError") {
    err = valideteErr(err);
  }
  next(err);
});

app.use((err, req, res, next) => {
  const { status = 500, message = "something went wrong" } = err;
  res.status(status).send(message);
});

app.listen(3000, (req, res) => {
  console.log("listening at 3000");
});
