import PostCardSale from "./PostCardSale";

interface Post {
  post_id: number;
  title: string;
  user: { user_id: number; name: string };
  description: string;
  created_at: string;
  post_type: { type_id: number; type_name: string };
  images?: { image_id: number; url: string }[];
  likes?: number;
  comments?: number;
  quantity_kg?: number;
  price_per_kg?: number;
  municipality?: { municipality_id: number; name: string };
  product?: {
    product_id: number;
    name: string;
    description: string;
    image_url: string;
  };
}

interface PostListSaleProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
  formatDate: (dateString: string) => string;
}

function PostListSale({ posts, onSelectPost, formatDate }: PostListSaleProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[calc(100vh-200px)] pr-2 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-transparent scrollbar-thumb-green-500/30 hover:scrollbar-thumb-green-500/50">
      {posts.map((post) => (
        <PostCardSale
          key={post.post_id}
          post={post}
          onSelectPost={onSelectPost}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
}

export default PostListSale;