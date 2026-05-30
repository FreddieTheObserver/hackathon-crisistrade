import EmergencyCard from "./EmergencyCard";
import type { EmergencyPost } from "../types/emergency.type";
import { EmptyState } from "../../../components/StateViews";

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
    return <EmptyState title="No emergency requests found." />;
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
