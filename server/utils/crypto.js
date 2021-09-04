const crypto = require("crypto");
const HASH_ALGO = "aes-256-cbc";
const IV_LENGTH = 16;
const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || "hxjYuf37NjovfI69hxjYuf37NjovfI69";

class Utils {
  generateToken(payload, secretKey = "sample_key") {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv(
      HASH_ALGO,
      new Buffer.from(ENCRYPTION_KEY),
      iv
    );
    let encrypted = cipher.update(JSON.stringify(payload));

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
  }

  randomString() {
    const seed = crypto.randomBytes(20);
    const uniqueSHA1String = crypto
      .createHash("sha1")
      .update(seed)
      .digest("hex");

    return uniqueSHA1String;
  }

  verifyToken(text, secretKey = "sample_key") {
    let textParts = text.split(":");
    let iv = new Buffer.from(textParts.shift(), "hex");
    let encryptedText = new Buffer.from(textParts.join(":"), "hex");
    let decipher = crypto.createDecipheriv(
      HASH_ALGO,
      new Buffer.from(ENCRYPTION_KEY),
      iv
    );
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return JSON.parse(decrypted.toString());
  }

  hash(data) {
    const hmac = crypto.createHmac("sha256", "a secret");

    hmac.update(data);
    return hmac.digest("hex");
  }
}

module.exports = new Utils();
