
import { useState, useEffect } from "react";
import { Product } from "@/integrations/supabase/database.types";
import { supabase } from "@/integrations/supabase/client";

export const useBillProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  
  // Fetch available products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');
          
        if (error) throw error;
        if (data) setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return { products };
};
