"use client";
import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { EntryActions } from "~/app/(root)/EntryActions";

type LastInputsType = {
  lastEntries: {
    id: number;
    quantity: number;
    backupCode: null;
    product: {
      name: string;
      code: string;
      quantity: number;
      loggedQuantity: number;
    };
  }[];
};

const setBackgroundColor = (product: any) => {
  if (product) {
    if (product.quantity === product.loggedQuantity) {
      return "green.100";
    } else if (product.quantity > product.loggedQuantity) {
      return "yellow.100";
    } else {
      return "red.100";
    }
  }
};

export const LastInputs = ({ lastEntries }: LastInputsType) => {
  return (
    <Box>
      {/* <Heading
        size="md"
        textAlign="center"
        fontFamily="sans-serif"
        color="white"
      >
        Last 5 entries
      </Heading> */}
      <Table>
        <Thead>
          <Tr>
            <Th>Code</Th>
            <Th>Name</Th>
            <Th>Current quantity</Th>
            <Th>In stock</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {lastEntries.map((entry) => (
            <Tr
              key={entry.id}
              backgroundColor={setBackgroundColor(entry.product)}
            >
              <Td>{entry.product ? entry.product.code : entry.backupCode}</Td>
              <Td>{entry.product ? entry.product.name : entry.backupCode}</Td>
              <Td>{entry.product ? entry.product.loggedQuantity : 0}</Td>
              <Td>{entry.product ? entry.product.quantity : 0}</Td>
              <Td>
                <EntryActions inventoryEntry={entry} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
