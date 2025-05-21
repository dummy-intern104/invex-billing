
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
    
    // Subscribe to products table changes
    const productsChannel = supabase
      .channel('billing-products-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          console.log('Products changed, refreshing products list');
          fetchProducts();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(productsChannel);
    };
  }, []);

  return { products };
};
