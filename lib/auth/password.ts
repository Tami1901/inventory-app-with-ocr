import { compare } from "bcryptjs";
import { Account } from "@prisma/client";

export const checkPassword = async (password: string, account: Account) => {
  if (!account.access_token) {
    return false;
  }

  return compare(password, account.access_token);
};
