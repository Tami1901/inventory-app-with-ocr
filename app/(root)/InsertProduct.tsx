"use client";

import { useState } from "react";
import { Product } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import SuperJSON from "superjson";

import { Input } from "~/components/Input";
import { useDebounce } from "~/lib/hooks/useDebounce";
import { CameraThingWrapper } from "./Camera";
import { Box, Button, Heading, Text } from "@chakra-ui/react";

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
      <Heading
        size="md"
        textAlign="center"
        mt="2"
        mb="6"
        fontFamily="sans-serif"
      >
        Select product
      </Heading>
      <Box w="100%" display="flex" mb="4">
        <Box
          as="button"
          w="100%"
          cursor="pointer"
          borderRadius="0"
          backgroundColor="unset"
          borderBottom={tab === "manual" ? "2px solid orange" : undefined}
          onClick={onTabChange("manual")}
        >
          Manual
        </Box>
        <Box
          as="button"
          w="100%"
          cursor="pointer"
          borderRadius="0"
          backgroundColor="unset"
          borderBottom={tab === "camera" ? "2px solid orange" : undefined}
          onClick={onTabChange("camera")}
        >
          Camera
        </Box>
      </Box>

      {tab === "manual" && (
        <>
          <div className="flex">
            <Input
              type="text"
              placeholder="Start typing..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            {productsQuery.isFetching && <p>Searching...</p>}
          </div>

          {productsQuery.isLoading && <p>Loading...</p>}
          {productsQuery.isError && <p>Error </p>}
          {productsQuery.data && (
            <>
              <ul>
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
              </ul>

              {code && productsQuery.data.products.length === 0 && (
                <p>No products found</p>
              )}
            </>
          )}
        </>
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
