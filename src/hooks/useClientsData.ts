
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Client } from '@/types/billing';

interface UseClientsDataResult {
  clientsData: Client[];
  topClients: Client[];
  totalClients: number;
  isLoading: boolean;
}

export const useClientsData = (userEmail: string): UseClientsDataResult => {
  const [clientsData, setClientsData] = useState<Client[]>([]);
  const [topClients, setTopClients] = useState<Client[]>([]);
  const [totalClients, setTotalClients] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClientsData = async () => {
      setIsLoading(true);
      try {
        // Get user ID from email
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', userEmail)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          setIsLoading(false);
          return;
        }

        const userId = userData?.id;

        // Get bills created by this user to find all client emails
        const { data: billsData, error: billsError } = await supabase
          .from('bills')
          .select('customer_email')
          .eq('created_by', userId);

        if (billsError) {
          console.error('Error fetching bills data:', billsError);
          setIsLoading(false);
          return;
        }

        if (!billsData || billsData.length === 0) {
          setIsLoading(false);
          return;
        }

        // Extract unique client emails
        const uniqueEmails = [...new Set(billsData.map(bill => bill.customer_email))];

        // Get client data for these emails
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('*')
          .in('email', uniqueEmails);

        if (clientsError) {
          console.error('Error fetching clients data:', clientsError);
          setIsLoading(false);
          return;
        }

        if (clientsData) {
          // Sort by total purchases
          const sortedClients = [...clientsData].sort((a, b) => b.total_purchases - a.total_purchases);
          
          setClientsData(sortedClients);
          setTopClients(sortedClients.slice(0, 5));
          setTotalClients(sortedClients.length);
        }
      } catch (error) {
        console.error('Error in clients data fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userEmail) {
      fetchClientsData();

      // Set up realtime subscription for clients table
      const getUserIdForSubscription = async () => {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', userEmail)
            .single();
          
          if (data) {
            // Subscribe to real-time updates for bills
            const billsChannel = supabase
              .channel('clients-bills-updates')
              .on(
                'postgres_changes',
                {
                  event: '*',
                  schema: 'public',
                  table: 'bills',
                  filter: `created_by=eq.${data.id}`
                },
                () => {
                  console.log('Bills changed, refreshing clients data');
                  fetchClientsData();
                }
              )
              .subscribe();

            // Subscribe to real-time updates for clients
            const clientsChannel = supabase
              .channel('clients-updates')
              .on(
                'postgres_changes',
                {
                  event: '*',
                  schema: 'public',
                  table: 'clients'
                },
                () => {
                  console.log('Clients changed, refreshing clients data');
                  fetchClientsData();
                }
              )
              .subscribe();

            return () => {
              supabase.removeChannel(billsChannel);
              supabase.removeChannel(clientsChannel);
            };
          }
        } catch (error) {
          console.error('Error setting up subscription:', error);
        }
      };
      
      getUserIdForSubscription();
    }
  }, [userEmail]);

  return {
    clientsData,
    topClients,
    totalClients,
    isLoading
  };
};
