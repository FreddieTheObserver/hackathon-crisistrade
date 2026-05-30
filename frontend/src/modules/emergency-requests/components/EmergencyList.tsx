import EmergencyCard from "./EmergencyCard";
import type { EmergencyPost } from "../types/emergency.type";

type EmergencyListProps = {
  onDeletePost: (postId: string) => void;
  onEditPost: (post: EmergencyPost) => void;
  onMarkHelped: (postId: string) => void;
  onPreviewPhoto: (photoUrl: string) => void;
  posts: EmergencyPost[];
};

const EmergencyList = ({
  onDeletePost,
  onEditPost,
  onMarkHelped,
  onPreviewPhoto,
  posts,
}: EmergencyListProps) => {
  if (posts.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white px-6 py-10">
        <p className="text-center text-sm font-medium text-slate-400">
          No emergency requests found.
        </p>
      </div>
    );
  }

  const ownerPosts = posts.filter((post) => post.isOwner);
  const otherPosts = posts.filter((post) => !post.isOwner);

  return (
    <div className="space-y-5">
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {ownerPosts.map((post) => (
          <EmergencyCard
            key={post.id}
            onDelete={onDeletePost}
            onEdit={onEditPost}
            onMarkHelped={onMarkHelped}
            onPreviewPhoto={onPreviewPhoto}
            post={post}
          />
        ))}
        {otherPosts.map((post) => (
          <EmergencyCard
            key={post.id}
            onDelete={onDeletePost}
            onEdit={onEditPost}
            onMarkHelped={onMarkHelped}
            post={post}
          />
        ))}
      </section>
    </div>
  );
};

export default EmergencyList;
