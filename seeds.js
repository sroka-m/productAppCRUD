const mongoose = require("mongoose");
const Product = require("./models/product.js");
const Farm = require("./models/farm.js");
mongoose
  .connect("mongodb://127.0.0.1:27017/farmStand")
  .then(console.log("connection opened"))
  .catch((e) => {
    console.log(e);
  });
// Product.deleteMany({}).then((data) => {
//   console.log(data);
// });

// const makeProduct = async () => {
//   return await Product.insertMany([
//     { name: "Apple", qty: 10, category: "fruit" },
//     { name: "Carrot", qty: 8, category: "vegetable" },
//     { name: "Cheddar", qty: 4, category: "dairy" },
//   ]);
// };
// makeProduct().then((data) => {
//   console.log(data);
// });
//   name: {
//     type: String,
//     required: true,
//   },
//   qty: {
//     type: Number,
//     required: true,
//     min: 0,
//   },
//   category: {
//     type: String,
//     enum: ["fruit", "vegetable", "dairy"],
//   },
// });

/////////////
//find all products and assign it to the Full Belly Farm
// async function addFarmToProducts() {
//   let fullBelly = await Farm.findOne({ name: "Full belly Frms" });
//   let products = await Product.find({});
//   for (let product of products) {
//     product.farm = fullBelly;
//     await product.save();
//   }
// }

// addFarmToProducts();

//we estabilished two way connection so we also need to find the farm and
async function addProductsToFarm() {
  let fullBelly = await Farm.findOne({ name: "Full belly Frms" });
  let products = await Product.find({});
  // console.log(products);
  fullBelly.products = products;
  await fullBelly.save();
}

// addProductsToFarm();
