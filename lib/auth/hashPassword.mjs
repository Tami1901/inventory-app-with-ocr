import bcrypt from "bcryptjs";

export const ROUNDS = 10;

/** @param {string} password */
export const hashPassword = async (password) => {
  return bcrypt.hash(password, ROUNDS);
};
