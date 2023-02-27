import {
  Box,
  Input,
  Text,
  OrderedList,
  Button,
  Heading,
} from "@chakra-ui/react";
import React from "react";

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

type ManualTabType = {
  code: string;
  setCode: (code: string) => void;
  productsQuery: any;
  setSelectedProduct: (selectedProduct: any) => void;
  selectedProduct: Omit<ProductType, "currentCount" | "quantity"> | null;
  onFormSubmit: any;
};

type ProductType = {
  id: number;
  name: string;
  code: string;
  currentCount: number;
  quantity: number;
};

export const ManualTab = ({
  code,
  setCode,
  productsQuery,
  setSelectedProduct,
  selectedProduct,
  onFormSubmit,
}: ManualTabType) => {
  return (
    <>
      <Heading size="sm" color="darkgrey">
        Enter the code
      </Heading>
      <Box backgroundColor="whiteAlpha.200" p="6" borderRadius="5px" mt="4">
        <Box w="100%" display="flex">
          <Input
            type="text"
            placeholder="Start typing..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            color="white"
          />
          {productsQuery.isFetching && <Text color="white">Searching...</Text>}
        </Box>

        {productsQuery.isLoading && <p>Loading...</p>}
        {productsQuery.isError && <p>Error </p>}
        {productsQuery.data && (
          <>
            <OrderedList>
              {productsQuery.data.products.map((product: ProductType) => (
                <li key={product.id}>
                  [<RenderCode productCode={product.code} searchCode={code} />]{" "}
                  {product.name} ({product.currentCount} / {product.quantity})
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
    </>
  );
};
