const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "farm must have a name!"],
  },
  city: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "email required!"],
  },
  products: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

const Farm = mongoose.model("Farm", farmSchema);
module.exports = Farm;
