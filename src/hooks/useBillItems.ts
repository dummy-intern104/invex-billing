
import { useState } from "react";
import { BillItem, Product } from "@/integrations/supabase/database.types";

export const useBillItems = () => {
  const [items, setItems] = useState<BillItem[]>([
    { product_id: "", product_name: "", quantity: 0, price: 0 }
  ]);

  const handleItemChange = (index: number, field: keyof BillItem, value: string | number) => {
    const newItems = [...items];
    
    if (field === 'quantity' || field === 'price') {
      newItems[index][field] = Number(value) || 0;
    } else if (field === 'product_id' && typeof value === 'string') {
      // Handle the manual entry option
      if (value === "manual") {
        newItems[index].product_id = "manual";
        // Don't reset product_name if already set - let the user keep their manual entry
        if (!newItems[index].product_name) {
          newItems[index].product_name = "";
        }
        // Only reset price if it wasn't manually set or was 0
        if (newItems[index].price === 0) {
          newItems[index].price = 0;
        }
      } else if (value === "") {
        // If "Select Product" is chosen
        newItems[index].product_id = "";
        newItems[index].product_name = "";
        newItems[index].price = 0;
      } else {
        // This part needs access to products array, we'll modify this function in useBillForm
        newItems[index].product_id = value;
      }
    } else {
      // For string fields like product_name
      // @ts-ignore - TypeScript doesn't know that these fields are strings
      newItems[index][field] = value;
    }
    
    setItems(newItems);
  };

  const updateItemWithProduct = (index: number, productId: string, products: Product[]) => {
    const product = products.find(p => p.product_id === productId);
    if (product) {
      const newItems = [...items];
      newItems[index].product_id = product.product_id;
      newItems[index].product_name = product.name;
      newItems[index].price = product.price;
      setItems(newItems);
    }
  };

  const addNewItem = () => {
    setItems([...items, { product_id: "", product_name: "", quantity: 0, price: 0 }]);
  };

  const resetItems = () => {
    setItems([{ product_id: "", product_name: "", quantity: 0, price: 0 }]);
  };

  return {
    items,
    handleItemChange,
    updateItemWithProduct,
    addNewItem,
    resetItems
  };
};
