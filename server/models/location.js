const mongoose = require("./base");

const Location = mongoose.model("location", {
  name: String,
  address: String,
  longitude: String,
  latitude: String,
  province: {
    type: mongoose.Types.ObjectId,
    ref: "province"
  },
  created: Date
});

module.exports = Location;
