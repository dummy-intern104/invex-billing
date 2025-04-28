import { useState } from "react";
import { BillItem } from "@/types/billing";
import { Product } from "@/integrations/supabase/database.types";

export const useBillItems = () => {
  const [items, setItems] = useState<BillItem[]>([
    {
      product_id: "",
      product_name: "",
      quantity: 1,
      price: 0
    }
  ]);

  const handleItemChange = (index: number, field: keyof BillItem, value: string | number) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      
      if (field === 'price' || field === 'quantity') {
        // Convert string to number
        newItems[index] = { 
          ...newItems[index], 
          [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
        };
      } else {
        newItems[index] = { ...newItems[index], [field]: value };
      }
      
      return newItems;
    });
  };
  
  const updateItemWithProduct = (index: number, productId: string, products: Product[]) => {
    const product = products.find(p => p.id === productId);
    
    if (product) {
      setItems(prevItems => {
        const newItems = [...prevItems];
        newItems[index] = { 
          ...newItems[index],
          product_id: productId,
          product_name: product.name,
          price: product.price
        };
        return newItems;
      });
    }
  };
  
  const addNewItem = () => {
    setItems(prevItems => [
      ...prevItems, 
      {
        product_id: "",
        product_name: "",
        quantity: 1,
        price: 0
      }
    ]);
  };

  const removeItem = (index: number) => {
    setItems(prevItems => {
      // If there's only one item, just clear it instead of removing
      if (prevItems.length === 1) {
        return [{
          product_id: "",
          product_name: "",
          quantity: 1,
          price: 0
        }];
      }
      // Otherwise filter out the item at the specified index
      return prevItems.filter((_, i) => i !== index);
    });
  };

  const resetItems = () => {
    setItems([
      {
        product_id: "",
        product_name: "",
        quantity: 1,
        price: 0
      }
    ]);
  };
  
  return {
    items,
    handleItemChange,
    updateItemWithProduct,
    addNewItem,
    removeItem,
    resetItems
  };
};
