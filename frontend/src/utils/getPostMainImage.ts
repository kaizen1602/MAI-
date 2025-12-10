import type { Post } from "../data/types/post.types";

// Type for the simplified post structure used in some components
interface SimplePost {
  images?: { id: number; url: string }[];
  product?: {
    image_url?: string;
  };
}

export default function getPostMainImage(post: Partial<Post> | Partial<SimplePost> | undefined): string {
  // Standardized fallback for posts without images
  const DEFAULT_POST_IMAGE = "/metodo-de-pago.png";

  if (!post) return DEFAULT_POST_IMAGE;

  // Prefer post images
  const firstImage = (post.images && post.images.length > 0 && post.images[0].url) || null;
  if (firstImage && firstImage.trim() !== "") {
    // Handle relative URLs that start with /storage/ by ensuring they're properly formed
    if (firstImage.startsWith('/storage/')) {
      return firstImage;
    }
    return firstImage;
  }

  // Fallback to product image
  const productImage = (post as any).product?.image_url || null;
  if (productImage && productImage.trim() !== "") {
    // Handle relative URLs that start with /storage/ by ensuring they're properly formed
    if (productImage.startsWith('/storage/')) {
      return productImage;
    }
    return productImage;
  }

  // Final fallback - use project-wide default image
  return DEFAULT_POST_IMAGE;
}