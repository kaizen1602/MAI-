import PostCard from "./PostCard";
import type { Post } from "../data/types/post.types";

interface PostListProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
  formatDate: (dateString: string) => string;
  onPostUpdated?: (updatedPost: Post) => void;
  onPostDeleted?: (postId: number) => void;
}

function PostList({ posts, onSelectPost, formatDate, onPostUpdated, onPostDeleted }: PostListProps) {
  return (
    <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] pr-2 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-transparent scrollbar-thumb-green-500/30 hover:scrollbar-thumb-green-500/50">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onSelectPost={onSelectPost}
          formatDate={formatDate}
          onPostUpdated={onPostUpdated}
          onPostDeleted={onPostDeleted}
        />
      ))}
    </div>
  );
}

export default PostList;