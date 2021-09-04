const mailUtil = require("../../utils/mail");
const utils = require("util");
const fs = require("fs");
const path = require("path");

fs.readFile = utils.promisify(fs.readFile);

const templateDir = path.join(__dirname, "..", "..", "templates");

const buildHTML = (template = "", obj) => {
  let output = template;
  const keys = Object.keys(obj);
  keys.forEach(key => {
    const regex = new RegExp(`{${key}}`, "g");
    output = output.replace(regex, obj[key]);
  });

  return output;
};

module.exports = {
  name: "SEND_MAIL",
  concurrency: 10,
  handler: async job => {
    const { data } = job;
    const { email, subject, template, ...info } = data;
    const templateStr = (
      await fs.readFile(path.join(templateDir, template))
    ).toString();

    const content = buildHTML(templateStr, info);
    mailUtil.sendEmail(email, subject, content);
  }
};
