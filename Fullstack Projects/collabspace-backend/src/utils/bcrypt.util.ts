import bcrypt from "bcryptjs";

export const hashPassword = async (value: string) => bcrypt.hash(value, 10);

export const comparePassword = async (value: string, hashedValue: string) =>
  bcrypt.compare(value, hashedValue);
