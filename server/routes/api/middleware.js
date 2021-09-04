const { verifyToken } = require("../../utils/crypto");
const User = require("../../models/user");

const authenticated = async (req, res, next) => {
  const { headers } = req;
  const token = headers["authorization"];

  if (!token) {
    res.status(401).json({
      message: "Missing authentication info"
    });
    return;
  }

  try {
    const data = verifyToken(token);
    const { email } = data;
    const user = await User.findOne({ email });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: error.message
    });
  }
};

module.exports = { authenticated };
