"use client";

import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import { InsertProduct } from "~/app/(root)/InsertProduct";
import { LastInputs } from "./LastInputs";

export const EntriesLayout = ({ allProductCodes, lastEntries }: any) => (
  <Grid templateColumns="repeat(4, 1fr)">
    <GridItem colSpan={3} p="4">
      <InsertProduct allProductCodes={allProductCodes} />
    </GridItem>
    <GridItem colSpan={1}>
      <LastInputs lastEntries={lastEntries} />
    </GridItem>
  </Grid>
);
