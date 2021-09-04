const mongoose = require("./base");
const uniqueValidator = require("mongoose-unique-validator");

const ProvinceSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    uniqueCaseInsensitive: true
  }
});
ProvinceSchema.plugin(uniqueValidator, {
  message: "Error, expected {PATH} to be unique."
});

const Province = mongoose.model("province", ProvinceSchema);

module.exports = Province;
