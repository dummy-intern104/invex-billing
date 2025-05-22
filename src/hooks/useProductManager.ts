
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ProductFormData {
  name: string;
  price: number;
  stock?: number;
  hsn_code?: string;
}

export const useProductManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addProduct = async (productData: ProductFormData) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          price: productData.price,
          stock: productData.stock || 0,
          product_id: `PROD-${Math.floor(100000 + Math.random() * 900000)}`,
          hsn_code: productData.hsn_code || null
        }])
        .select();

      if (error) {
        toast({
          title: "Error adding product",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error };
      }

      toast({
        title: "Product added",
        description: `${productData.name} has been successfully added.`,
      });
      
      return { success: true, data };
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error adding product",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addProduct,
    isLoading
  };
};
