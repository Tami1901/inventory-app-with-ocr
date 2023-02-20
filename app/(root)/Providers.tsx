"use client";

import { PropsWithChildren, useState } from "react";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";

type ProviderProps = PropsWithChildren<{ session: Session | null }>;

export const Providers: React.FC<ProviderProps> = (props) => {
  const { children, session } = props;
  const [client] = useState(() => new QueryClient());

  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </ChakraProvider>
    </SessionProvider>
  );
};
