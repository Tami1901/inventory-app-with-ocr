import { Box } from "@chakra-ui/react";
import React, { MouseEventHandler, useState } from "react";
import { BsFillCameraFill } from "react-icons/bs";
import { MdOutlineInventory } from "react-icons/md";
import { TfiWrite } from "react-icons/tfi";

type SidebarType = {
  tab: string;
  onTabChange: (tab: string) => MouseEventHandler<HTMLDivElement> | undefined;
};

export const Sidebar = ({ tab, onTabChange }: SidebarType) => {
  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      display="flex"
      flexDir="column"
      height="100vh"
      backgroundColor="whiteAlpha.100"
    >
      <Box
        display="flex"
        width="100%"
        cursor="pointer"
        justifyContent="center"
        alignItems="center"
        p="26px"
        backgroundColor={tab === "home" ? "orange.800" : "unset"}
      >
        <MdOutlineInventory size="20px" color="white" />
      </Box>
      <Box
        cursor="pointer"
        onClick={onTabChange("camera")}
        display="flex"
        width="100%"
        justifyContent="center"
        alignItems="center"
        p="26px"
        backgroundColor={tab === "camera" ? "blue.600" : "unset"}
      >
        <BsFillCameraFill size="20px" color="white" />
      </Box>
      <Box
        cursor="pointer"
        display="flex"
        width="100%"
        justifyContent="center"
        alignItems="center"
        onClick={onTabChange("manual")}
        borderRadius="0"
        p="26px"
        backgroundColor={tab === "manual" ? "blue.600" : "unset"}
      >
        <TfiWrite size="20px" color="white" />
      </Box>
    </Box>
  );
};
