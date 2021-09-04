const { Router } = require("express");
const User = require("../../models/user");
const office365Util = require("../../utils/office365");
const { generateToken, verifyToken } = require("../../utils/crypto");

const router = Router();

router.post("/login", async (req, res) => {
  const { accessToken } = req.body;
  const officeUser = await office365Util.getUser(accessToken);
  const { displayName, mail } = officeUser;
  let user = await User.findOne({ email: mail })
    .populate("department")
    .populate("school");
  if (!user) {
    user = new User({
      email: mail,
      name: displayName,
      created: new Date()
    });

    await user.save();
  }

  const token = generateToken(
    JSON.stringify({
      id: user._id,
      date: new Date()
    })
  );
  res.json({ user, token, _id: user._id });
});

router.get("/", async (req, res) => {
  const users = await User.find({})
    .sort({ name: 1 })
    .populate("department")
    .populate("school");

  res.json({
    message: "Success",
    data: users
  });
});

router.get("/by-email/:email", async (req, res) => {
  const users = await User.findOne({ email: req.params.email })
    .populate("department")
    .populate("school");

  res.json({
    message: "Success",
    data: users
  });
});

// router.post("/", async (req, res) => {
//   const { email, name, role } = req.body;
//   const newUser = new User({ email, name, role });

//   await newUser.save();

//   res.send({
//     message: "Success",
//     data: newUser
//   });
// });

router.put("/:_id", async (req, res) => {
  try {
    const { body } = req;
    const { role, department, school, name, email } = body;

    await User.findOneAndUpdate(
      { _id: req.params._id },
      { $set: { role, department, school, name, email } }
    );

    res.json({ message: "Update success" });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.delete("/:_id", async (req, res) => {
  await User.deleteOne({ _id: req.params._id });

  res.json({ message: "update success" });
});

module.exports = router;
