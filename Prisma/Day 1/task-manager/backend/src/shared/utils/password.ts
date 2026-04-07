import bcrypt from "bcryptjs";

const PASSWORD_SALT_ROUNDS = 10;

export const hashPassword = async (value: string): Promise<string> => {
  return bcrypt.hash(value, PASSWORD_SALT_ROUNDS);
};

export const verifyPassword = async (
  value: string,
  hashedValue: string,
): Promise<boolean> => {
  return bcrypt.compare(value, hashedValue);
};
