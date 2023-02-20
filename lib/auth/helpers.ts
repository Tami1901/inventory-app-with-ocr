import { redirect } from "next/navigation";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./config";

export const requireLogin = async () => {
  const session = await unstable_getServerSession(authOptions);
  if (!session) {
    redirect("/auth/login");
  }

  return session;
};
