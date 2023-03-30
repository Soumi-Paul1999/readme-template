require("dotenv").config();

const dev = {
  app: {
    port: process.env.PORT || 4000,
  },

  db: {
    url:
      process.env.DB_URL ||
      "mongodb+srv://Soumi:soumi1234@atlascluster.81pwmyq.mongodb.net/anisulcrudapi",
  },
};

module.exports = dev;
