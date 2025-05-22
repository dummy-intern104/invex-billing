
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  product_id: string;
  hsn_code: string | null;
  created_at: string;
}

const ProductsListing: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name');

        if (error) {
          console.error("Error fetching products:", error);
          toast({
            title: "Error loading products",
            description: error.message,
            variant: "destructive"
          });
        } else {
          setProducts(data || []);
        }
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error loading products",
          description: "Failed to load products",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    // Set up real-time subscription for products table
    const productsSubscription = supabase
      .channel('products-channel')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'products' 
        }, 
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productsSubscription);
    };
  }, [toast]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <Card className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm text-center py-8">
        <CardContent>
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No products found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Start by adding products in the product management tab.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Card key={product.id} className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>{product.name}</span>
              <span className="text-sm font-normal text-gray-500">{product.product_id}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-medium">₹{product.price.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Stock</p>
                <p className="font-medium">{product.stock} units</p>
              </div>
              {product.hsn_code && (
                <div>
                  <p className="text-sm text-gray-500">HSN Code</p>
                  <p className="font-medium">{product.hsn_code}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductsListing;
