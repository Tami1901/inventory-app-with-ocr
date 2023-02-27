"use client";

import React, { useState } from "react";
import { Product } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import SuperJSON from "superjson";

import { useDebounce } from "~/lib/hooks/useDebounce";
import { CameraThingWrapper } from "./Camera";
import { Box, Button, Input, OrderedList, Text } from "@chakra-ui/react";
import { TfiWrite } from "react-icons/tfi";
import { BsFillCameraFill } from "react-icons/bs";

const RenderCode: React.FC<{ searchCode: string; productCode: string }> = (
  props
) => {
  const { searchCode, productCode } = props;
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: productCode.replace(searchCode, `<b>${searchCode}</b>`),
      }}
    />
  );
};

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
    <Box>
      <Box w="100%" display="flex" my="8">
        <Button
          w="100%"
          cursor="pointer"
          borderRadius="5px"
          colorScheme="green"
          p="80px 10px"
          mr="10"
          onClick={onTabChange("camera")}
        >
          <BsFillCameraFill size="40px" />
        </Button>
        <Button
          w="100%"
          cursor="pointer"
          borderRadius="5px"
          p="80px 10px"
          colorScheme="blue"
          onClick={onTabChange("manual")}
        >
          <TfiWrite size="40px" />
        </Button>
      </Box>

      {tab === "manual" && (
        <Box backgroundColor="whiteAlpha.200" p="10" borderRadius="5px">
          <Box w="100%" display="flex">
            <Input
              type="text"
              placeholder="Start typing..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              color="white"
            />
            {productsQuery.isFetching && (
              <Text color="white">Searching...</Text>
            )}
          </Box>

          {productsQuery.isLoading && <p>Loading...</p>}
          {productsQuery.isError && <p>Error </p>}
          {productsQuery.data && (
            <>
              <OrderedList>
                {productsQuery.data.products.map((product) => (
                  <li key={product.id}>
                    [<RenderCode productCode={product.code} searchCode={code} />
                    ] {product.name} ({product.currentCount} /{" "}
                    {product.quantity})
                    <Button
                      size="sm"
                      onClick={() =>
                        setSelectedProduct({
                          id: product.id,
                          name: product.name,
                          code: product.code,
                        })
                      }
                    >
                      Select
                    </Button>
                  </li>
                ))}
                {productsQuery.data.hasMore && <li>...</li>}
              </OrderedList>

              {code && productsQuery.data.products.length === 0 && (
                <p>No products found</p>
              )}
            </>
          )}
        </Box>
      )}

      {tab === "camera" && (
        <CameraThingWrapper
          allProductCodes={allProductCodes}
          select={setSelectedProduct}
        />
      )}

      {selectedProduct && (
        <>
          <p>Selected product: {selectedProduct.code}</p>
          <form onSubmit={onFormSubmit}>
            <Input name="quantity" type="number" />
            <Button type="submit">Save</Button>
          </form>
        </>
      )}
    </Box>
  );
};
