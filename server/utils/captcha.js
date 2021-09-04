const axios = require("axios");

class CaptchaUtil {
  async verifyRecaptcha(recaptchaData) {
    const verificationUrl =
      "https://www.google.com/recaptcha/api/siteverify?secret=" +
      "6LeJO74UAAAAABVeXJuWEAHJoW2cNy5-SYJu4WvD" +
      "&response=" +
      recaptchaData +
      "&remoteip=" +
      "localhost";

    const response = await axios.get(verificationUrl);
    const { success } = response.data;
    if (!success) {
      throw new Error("Captcha fail");
    }
  }
}

module.exports = new CaptchaUtil();
