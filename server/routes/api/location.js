const { Router } = require("express");
const Location = require("../../models/location");
const router = Router();

router.get("/", async (req, res) => {
  const locations = await Location.find({}).populate("province");

  res.json({
    message: "Success",
    data: locations
  });
});

router.post("/", async (req, res) => {
  const { name, address, province } = req.body;
  const newLocation = new Location({ name, address, province });

  await newLocation.save();

  res.send({
    message: "Success",
    data: newLocation
  });
});

router.put("/:_id", async (req, res) => {
  await Location.findOneAndUpdate({ _id: req.params._id }, { $set: req.body });

  res.json({ message: "Update success" });
});

router.delete("/:_id", async (req, res) => {
  await Location.findByIdAndDelete(req.params._id);

  res.json({ message: "update success" });
});

router.get("/byProvince/:id", async (req, res) => {
  const { id } = req.params;
  const locations = await Location.find({ province: id }).populate("province");

  res.json({
    message: "Success",
    data: locations
  });
});

module.exports = router;
