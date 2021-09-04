const { Router } = require("express");
const Department = require("../../models/department");
const imageUtil = require("../../utils/image");
const router = Router();

router.get("/", async (req, res) => {
  const departments = await Department.find({}).sort({ name: 1 });

  res.json({
    message: "Success",
    data: departments
  });
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  const newDepartment = new Department({
    name,
    created: new Date()
  });

  await newDepartment.save();

  res.send({
    message: "Success",
    data: newDepartment
  });
});

router.put("/:_id", async (req, res) => {
  await Department.findOneAndUpdate(
    { _id: req.params._id },
    { $set: req.body }
  );

  res.json({ message: "Update success" });
});

router.delete("/:_id", async (req, res) => {
  await Department.findByIdAndDelete(req.params._id);

  res.json({ message: "update success" });
});

module.exports = router;
