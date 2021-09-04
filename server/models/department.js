const mongoose = require("./base");

const Department = mongoose.model("department", {
  name: String,
  created: Date
});

module.exports = Department;
