const mongoose = require("mongoose");

const supplementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    measureUnit: {
      type: String,
      required: true,
      enum: ["mg", "g", "kg", "lb", "oz", "tbsp", "tsp"],
    },
  },
  { timestamps: true }
);

const SupplementModel = mongoose.model("Supplement", supplementSchema);
module.exports = SupplementModel;
