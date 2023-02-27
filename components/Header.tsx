"use client";
import { Box, Heading } from "@chakra-ui/react";

import Link from "next/link";

export const Header = () => {
  return (
    <Box
      w="100%"
      display="flex"
      p="16px 100px"
      justifyContent="space-between"
      alignItems="center"
    >
      <Heading fontFamily="sans-serif" color="darkgrey">
        Inventory app
      </Heading>
      <Box>
        <Link
          href="/admin/upload"
          style={{ marginRight: "20px", color: "darkgrey" }}
        >
          Upload
        </Link>

        <Link href="/api/auth/signout" style={{ color: "darkgrey" }}>
          SignOut
        </Link>
      </Box>
    </Box>
  );
};
