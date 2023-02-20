"use client";

import { useSession } from "next-auth/react";

export const User: React.FC = () => {
  const { data } = useSession();

  return <h2>{data?.user.name}</h2>;
};
