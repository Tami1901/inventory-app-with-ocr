"use client";

import { useRouter } from "next/navigation";

import { Button } from "~/components/Button";
import { InventoryEntryWithProduct } from "./page";

type EntryActionsProps = { inventoryEntry: InventoryEntryWithProduct };
const useApi = () => {
  const router = useRouter();
  return async (id: number, method: "DELETE" | "PATCH", body?: any) => {
    const res = await fetch(`/api/inventory-entries/${id}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      alert("Error");
    }

    router.refresh();
  };
};

export const EntryActions: React.FC<EntryActionsProps> = ({ inventoryEntry }) => {
  const api = useApi();
  const onDelete = async () => {
    if (window.confirm("Are you sure?")) {
      await api(inventoryEntry.id, "DELETE");
    }
  };

  const onUpdate = async () => {
    let message = `Enter new quantity (max ${inventoryEntry.product?.quantity})`;
    if (inventoryEntry.product) {
      message += `\nOstalo uneseno ${
        inventoryEntry.product.loggedQuantity - inventoryEntry.quantity
      }`;
      message += `\nUkupno uneseno ${inventoryEntry.product.loggedQuantity}`;
    }

    const rawQuantity = window.prompt(message, String(inventoryEntry.quantity));
    if (!rawQuantity) {
      return;
    }

    const newQuantity = Number(rawQuantity);
    if (isNaN(newQuantity)) {
      alert("Invalid number");
      return;
    }

    api(inventoryEntry.id, "PATCH", { quantity: newQuantity });
  };

  return (
    <div className="flex space-x-2">
      <Button variantColor="green" size="sm" onClick={onUpdate}>
        Edit
      </Button>
      <Button variantColor="red" size="sm" onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
};
