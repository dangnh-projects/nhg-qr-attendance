const axios = require("axios");

class Office365Util {
  getUser = async token => {
    const userResponse = await axios.get(
      "https://graph.microsoft.com/v1.0/me",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return userResponse.data;
  };
}

module.exports = new Office365Util();
