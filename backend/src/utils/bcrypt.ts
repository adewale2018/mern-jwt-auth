import bcrypt from "bcrypt";

export const hashValue = async (value: string, saltsRound?: number) => {
   return bcrypt.hash(value, saltsRound || 10);
}

export const compareValue = async (value: string, hashedValue: string) => {
  return bcrypt.compare(value, hashedValue).catch(() => false);
}