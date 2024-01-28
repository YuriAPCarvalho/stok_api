const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

function createAuthToken(data) {
  return jwt.sign(data, SECRET, { expiresIn: "1d" });
}

function decodeAuthToken(token) {
  const decoded = jwt.verify(token, SECRET); 

  if (!decoded) {
    throw new Error("Invalid Auth Token");
  }

  return decoded; 
}


module.exports = { createAuthToken, decodeAuthToken };