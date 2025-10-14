import PostCard from "./PostCard";

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
}

interface PostListProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
  formatDate: (dateString: string) => string;
}

function PostList({ posts, onSelectPost, formatDate }: PostListProps) {
  return (
    <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] pr-2 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-transparent scrollbar-thumb-green-500/30 hover:scrollbar-thumb-green-500/50">
      {posts.map((post) => (
        <PostCard
          key={post.post_id}
          post={post}
          onSelectPost={onSelectPost}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
}

export default PostList;