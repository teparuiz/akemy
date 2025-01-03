

require("dotenv").config();

const authenticateApiKey = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authorizationHeader.split(" ")[1];

  if (token !== process.env.API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};

module.exports = authenticateApiKey;
