import PostCardSale from "./PostCardSale";
import type { Post } from "../data/types/post.types";

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
          key={post.id}
          post={post}
          onSelectPost={onSelectPost}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
}

export default PostListSale;
