/**
 * Transaction Service
 *
 * Handles all transaction-related operations:
 * - Get purchase history
 * - Create transactions
 * - Create reviews for transactions
 */

import { BaseService } from './base/BaseService';
import { ENDPOINTS } from '../api/endpoints';

export interface Transaction {
  id: number;
  buyer_id: number;
  seller_id: number;
  post_id: number;
  quantity_kg: number;
  price_per_kg: number;
  total_amount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  seller?: {
    id: number;
    name: string;
    email: string;
  };
  post?: {
    id: number;
    title: string;
    description: string;
    images?: { id: number; image_url: string }[];
    product?: { id: number; name: string; image_url: string };
  };
  review?: {
    id: number;
    rating: number;
    comment: string;
  };
}

export interface Purchase {
  id: number;
  title: string;
  sellerName: string;
  sellerId: number;
  date: string;
  price: number;
  imageUrl: string;
  rating: number;
}

class TransactionService extends BaseService {
  /**
   * Get purchase history for the authenticated user
   */
  async getPurchaseHistory(): Promise<Purchase[]> {
    const transactions = await this.handleRequest<Transaction[]>(
      this.client.get(ENDPOINTS.TRANSACTIONS.PURCHASE_HISTORY)
    );

    // Transform backend data to frontend format
    return transactions.map(t => ({
      id: t.id,
      title: t.post?.title || 'Producto',
      sellerName: t.seller?.name || 'Vendedor',
      sellerId: t.seller_id,
      date: t.completed_at || t.created_at,
      price: t.total_amount,
      imageUrl: t.post?.images?.[0]?.image_url || t.post?.product?.image_url || '/default-product.jpg',
      rating: t.review?.rating || 0,
    }));
  }

  /**
   * Create a review for a transaction
   */
  async createReview(transactionId: number, data: { rating: number; comment?: string }): Promise<void> {
    await this.handleRequest(
      this.client.post(ENDPOINTS.TRANSACTIONS.CREATE_REVIEW(transactionId), data)
    );
  }

  /**
   * Get all transactions
   */
  async getTransactions(): Promise<Transaction[]> {
    return this.handleRequest<Transaction[]>(
      this.client.get(ENDPOINTS.TRANSACTIONS.BASE)
    );
  }
}

export default new TransactionService();
