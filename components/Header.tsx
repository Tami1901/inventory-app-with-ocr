"use client";
import { Box, Heading } from "@chakra-ui/react";
import Link from "next/link";

export const Header = () => {
  return (
    <Box
      w="100%"
      display="flex"
      p="10px 80px"
      justifyContent="space-between"
      borderBottom="1px solid #e2e8f0"
      alignItems="center"
      >
        <Heading  fontFamily="sans-serif">Inventura app</Heading>
        <Box>
          <Link href="/admin/upload" style={{ marginRight: "20px" }}>
            Upload
          </Link>

          <Link href="/api/auth/signout">SignOut</Link>
        </Box>
      </Box>
  )
}