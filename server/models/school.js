const mongoose = require("./base");

const School = mongoose.model("school", {
  name: String,
  code: {
    type: String,
    unique: true,
    required: true
  },
  created: Date
});

module.exports = School;
