const { Router } = require("express");
const School = require("../../models/school");
const router = Router();

router.get("/", async (req, res) => {
  const schools = await School.find({}).sort({ name: 1 });

  res.json({
    message: "Success",
    data: schools
  });
});

router.post("/", async (req, res) => {
  try {
    const { name, code } = req.body;
    const newSchool = new School({
      name,
      code,
      created: new Date()
    });

    await newSchool.save();

    res.send({
      message: "Success",
      data: newSchool
    });
  } catch (error) {
    if (error && error.code === 11000) {
      const { keyValue } = error;
      const message = Object.keys(keyValue)
        .map(key => `${key}: ${keyValue[key]}`)
        .join(", ");
      res.status(500).json({ message: "Duplicated " + message });
      return;
    }
    res.status(500).json({ message: error.message });
  }
});

router.put("/:_id", async (req, res) => {
  try {
    await School.findOneAndUpdate({ _id: req.params._id }, { $set: req.body });

    res.json({ message: "Update success" });
  } catch (error) {
    if (error && error.code === 11000) {
      const { keyValue } = error;
      const message = Object.keys(keyValue)
        .map(key => `${key}: ${keyValue[key]}`)
        .join(", ");
      res.status(500).json({ message: "Duplicated " + message });
      return;
    }
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:_id", async (req, res) => {
  await School.findByIdAndDelete(req.params._id);

  res.json({ message: "Delete success" });
});

module.exports = router;
