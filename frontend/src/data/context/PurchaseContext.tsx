import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Purchase {
  id: number;
  title: string;
  sellerName: string;
  date: string;
  price: number;
  imageUrl: string;
  rating?: number;
  sellerId: number;
  productId: number;
}

interface PurchaseContextType {
  purchases: Purchase[];
  addPurchase: (purchase: Omit<Purchase, 'id' | 'date'>) => void;
  updatePurchaseRating: (purchaseId: number, rating: number) => void;
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

  const addPurchase = (purchaseData: Omit<Purchase, 'id' | 'date'>) => {
    const newPurchase: Purchase = {
      ...purchaseData,
      id: Date.now(), // Simple ID generation
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
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

  const value: PurchaseContextType = {
    purchases,
    addPurchase,
    updatePurchaseRating,
  };

  return (
    <PurchaseContext.Provider value={value}>
      {children}
    </PurchaseContext.Provider>
  );
};
