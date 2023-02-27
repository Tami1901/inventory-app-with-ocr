"use client";

import React, { useState } from "react";
import { Product } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import SuperJSON from "superjson";

import { useDebounce } from "~/lib/hooks/useDebounce";
import { CameraThingWrapper } from "./Camera";
import { Sidebar } from "~/components/Sidebar";
import { ManualTab } from "~/components/ManualTab";

type Props = {
  allProductCodes: { code: string; id: number; name: string }[];
};

export const InsertProduct: React.FC<Props> = ({ allProductCodes }) => {
  const [selectedProduct, setSelectedProduct] = useState<{
    id: number;
    name: string;
    code: string;
  } | null>(null);

  const [code, setCode] = useState("");
  const debouncedCode = useDebounce(code);
  const productsQuery = useQuery(
    ["products", debouncedCode],
    async ({ queryKey }) => {
      const [_, code] = queryKey;
      const res = await fetch(`/api/products?code=${code}`);
      const data = await res.json();
      return SuperJSON.deserialize<{
        products: (Product & { currentCount: number })[];
        hasMore: boolean;
      }>(data);
    },
    { keepPreviousData: true }
  );

  const router = useRouter();
  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    try {
      const res = await fetch(`/api/inventory-entries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: selectedProduct!.id,
          quantity: Number(data.get("quantity")),
        }),
      });

      if (!res.ok) {
        alert("Error");
        return;
      }

      setSelectedProduct(null);
      setCode("");

      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const [tab, setTab] = useState("manual");
  const onTabChange = (tab: string) => () => {
    setSelectedProduct(null);
    setTab(tab);
  };

  return (
    <>
      <Sidebar tab={tab} onTabChange={onTabChange} />

      {tab === "manual" && (
        <ManualTab
          code={code}
          setCode={setCode}
          productsQuery={productsQuery}
          setSelectedProduct={setSelectedProduct}
          selectedProduct={selectedProduct}
          onFormSubmit={onFormSubmit}
        />
      )}

      {tab === "camera" && (
        <CameraThingWrapper
          allProductCodes={allProductCodes}
          select={setSelectedProduct}
        />
      )}
    </>
  );
};
