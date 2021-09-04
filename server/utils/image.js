const util = require("util");
const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const QRCode = require("qrcode");

//ref:  https://github.com/ChrisCinelli/branded-qr-code/blob/master/lib/generate.js

fs.writeFile = util.promisify(fs.writeFile);
fs.readFile = util.promisify(fs.readFile);
let nhgLogo;

async function readImageFromPath(imgPath) {
  return new Promise(async (res, rej) => {
    const buf = await fs.readFile(imgPath);
    new Jimp(buf, (err, img) => {
      if (err) return rej(err);
      res(img);
    });
  });
}

const uploadFolder = path.join(__dirname, "..", "images");

const randomString = () => {
  const seed = crypto.randomBytes(20);
  const uniqueSHA1String = crypto
    .createHash("sha1")
    .update(seed)
    .digest("hex");

  return uniqueSHA1String;
};

const decodeBase64Image = dataString => {
  const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  const response = {};

  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }

  response.type = matches[1];
  response.data = new Buffer.from(matches[2], "base64");

  return response;
};

class ImageUtils {
  async base64ToFile(base64Str, fileName) {
    const fsName = fileName || "image-" + randomString();
    try {
      const imageData = decodeBase64Image(base64Str);
      const fullFileName = fsName + "." + imageData.type.split("/").pop();
      await fs.writeFile(path.join(uploadFolder, fullFileName), imageData.data);

      return fullFileName;
    } catch (error) {
      console.log(error);
      return "";
    }
  }

  async createFullQr(imgName) {
    try {
      if (!nhgLogo) {
        nhgLogo = await readImageFromPath(
          path.join(__dirname, "..", "assets", "nhg-logo-01-small.jpg")
        );
      }

      const currentLogo = await readImageFromPath(
        path.join(__dirname, "..", "images", imgName)
      );

      // Center the logo
      const x = Math.floor(
        (currentLogo.bitmap.width - nhgLogo.bitmap.width) / 2
      );
      const y = Math.floor(
        (currentLogo.bitmap.height - nhgLogo.bitmap.height) / 2
      );

      // Apply on the QRCode
      const qrcurrentLogo = currentLogo.composite(nhgLogo, x, y);
      return new Promise((res, rej) => {
        qrcurrentLogo.getBuffer(Jimp.MIME_PNG, async (err, buf) => {
          if (err) return rej(err);

          await fs.writeFile(path.join(uploadFolder, imgName), buf);
          return res(buf.toString("base64"));
        });
      });
    } catch (error) {
      console.log("errror in compose");
      console.log(error);
      throw error;
    }
  }

  generateImage = async txt => {
    const data = await QRCode.toDataURL(txt, { color: { dark: "#008000" } });
    const name = await this.base64ToFile(data);
    return name;
  };
}

module.exports = new ImageUtils();
