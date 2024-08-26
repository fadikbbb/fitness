const bcrypt = require("bcrypt");

// Hash Password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

// Compare Password
const comparePassword = async (candidatePassword, hashedPassword) => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
