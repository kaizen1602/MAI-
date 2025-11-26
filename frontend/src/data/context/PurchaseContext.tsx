import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { transactionService } from '../services';
import { useAuth } from './AuthContext';

export interface Purchase {
  id: number;
  title: string;
  sellerName: string;
  date: string;
  price: number;
  imageUrl: string;
  rating?: number;
  sellerId: number;
  productId?: number;
}

interface PurchaseContextType {
  purchases: Purchase[];
  isLoading: boolean;
  addPurchase: (purchase: Omit<Purchase, 'id' | 'date'>) => void;
  updatePurchaseRating: (purchaseId: number, rating: number) => void;
  refreshPurchases: () => Promise<void>;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export const usePurchases = () => {
  const context = useContext(PurchaseContext);
  if (context === undefined) {
    throw new Error('usePurchases must be used within a PurchaseProvider');
  }
  return context;
};

interface PurchaseProviderProps {
  children: ReactNode;
}

export const PurchaseProvider: React.FC<PurchaseProviderProps> = ({ children }) => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load purchases from backend when user is authenticated
  const loadPurchases = async () => {
    if (!user) {
      setPurchases([]);
      return;
    }

    try {
      setIsLoading(true);
      const data = await transactionService.getPurchaseHistory();
      setPurchases(data);
    } catch (error) {
      console.error('Error loading purchases:', error);
      // Keep purchases empty on error - no mock data
      setPurchases([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPurchases();
  }, [user?.id]);

  const addPurchase = (purchaseData: Omit<Purchase, 'id' | 'date'>) => {
    const newPurchase: Purchase = {
      ...purchaseData,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
    };

    setPurchases(prev => [...prev, newPurchase]);
  };

  const updatePurchaseRating = (purchaseId: number, rating: number) => {
    setPurchases(prev =>
      prev.map(purchase =>
        purchase.id === purchaseId
          ? { ...purchase, rating }
          : purchase
      )
    );
  };

  const refreshPurchases = async () => {
    await loadPurchases();
  };

  const value: PurchaseContextType = {
    purchases,
    isLoading,
    addPurchase,
    updatePurchaseRating,
    refreshPurchases,
  };

  return (
    <PurchaseContext.Provider value={value}>
      {children}
    </PurchaseContext.Provider>
  );
};
