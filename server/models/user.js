const mongoose = require("./base");

const User = mongoose.model("user", {
  name: String,
  email: String,
  role: {
    type: String,
    emum: ["NORMAL", "ADMIN"],
    default: "NORMAL"
  },
  department: {
    type: mongoose.Types.ObjectId,
    ref: "department"
  },
  school: {
    type: mongoose.Types.ObjectId,
    ref: "school"
  },
  created: Date
});

module.exports = User;
