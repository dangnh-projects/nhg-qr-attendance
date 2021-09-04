const { Router } = require("express");
const Province = require("../../models/province");
const router = Router();

router.get("/", async (req, res) => {
  const provinces = await Province.find({}).sort({ name: 1 });

  res.json({
    message: "Success",
    data: provinces
  });
});

router.post("/", async (req, res) => {
  const { name, address } = req.body;
  try {
    const newProvince = new Province({ name, address });

    await newProvince.save();

    res.send({
      message: "Success",
      data: newProvince
    });
  } catch (error) {
    console.log(error);
    if (error && error.code === 11000) {
      res.status(500).json({ message: "Duplicated name: " + name });
      return;
    }
    res.status(500).json({ message: error.message });
  }
});

router.put("/:_id", async (req, res) => {
  const { body } = req;

  await Province.findOneAndUpdate({ _id: req.params._id }, { $set: req.body });

  res.json({ message: "Update success" });
});

router.delete("/:_id", async (req, res) => {
  await Province.findByIdAndDelete(req.params._id);

  res.json({ message: "update success" });
});

module.exports = router;
