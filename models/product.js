const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ["fruit", "vegetable", "dairy"],
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

// required: true,
