const mongoose = require("mongoose");
const Product = require("./models/product.js");
mongoose
  .connect("mongodb://127.0.0.1:27017/farmStand2")
  .then(console.log("connection opened"))
  .catch((e) => {
    console.log(e);
  });
// Product.deleteMany({}).then((data) => {
//   console.log(data);
// });

const makeProduct = async () => {
  return await Product.insertMany([
    { name: "Apple", qty: 10, category: "fruit" },
    { name: "Carrot", qty: 8, category: "vegetable" },
    { name: "Cheddar", qty: 4, category: "dairy" },
  ]);
};
makeProduct().then((data) => {
  console.log(data);
});
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
