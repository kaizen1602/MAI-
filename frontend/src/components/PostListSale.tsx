import PostCardSale from "./PostCardSale";
import type { Post } from "../data/types/post.types";

interface PostListSaleProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
  formatDate: (dateString: string) => string;
  title?: string;
}

function PostListSale({
  posts,
  onSelectPost,
  formatDate,
  title = "Publicaciones",
}: PostListSaleProps) {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md p-5 border border-blue-100 dark:border-blue-900/50">
      {title && (
        <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-4 pb-2 border-b border-blue-100 dark:border-blue-900/50">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[calc(100vh-220px)] pr-2 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-transparent scrollbar-thumb-blue-500/30 hover:scrollbar-thumb-blue-500/50">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCardSale
              key={post.id}
              post={post}
              onSelectPost={onSelectPost}
              formatDate={formatDate}
            />
          ))
        ) : (
          <div className="col-span-2 text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">
              No se encontraron publicaciones
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostListSale;
