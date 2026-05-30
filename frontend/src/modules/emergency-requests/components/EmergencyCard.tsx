import EmergencyIcon from "./EmergencyIcon";
import type { EmergencyPost } from "../types/emergency.type";
import editLogo from "../assets/EditLogo.svg";
import locationLogo from "../assets/LocationLogo.svg";
import trashLogo from "../assets/TrashLogo.svg";

type EmergencyCardProps = {
  onDelete?: (postId: string) => void;
  onEdit?: (post: EmergencyPost) => void;
  onMarkHelped?: (postId: string) => void;
  onPreviewPhoto?: (photoUrl: string) => void;
  post?: EmergencyPost;
};

const urgencyClassNames = {
  Low: "bg-yellow-100 text-yellow-700",
  Medium: "bg-orange-100 text-orange-700",
  Urgent: "bg-red-100 text-red-600",
};

const statusClassNames = {
  Helped: "bg-blue-100 text-blue-700",
  Open: "bg-green-100 text-green-700",
};

const getPostTimeLabel = (createdAt: string) => {
  const createdAtTime = new Date(createdAt).getTime();
  const diffMs = Date.now() - createdAtTime;
  const diffHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));

  if (diffHours < 1) {
    return "Just now";
  }

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  return `${Math.floor(diffHours / 24)}d ago`;
};

const EmergencyCard = ({
  onDelete,
  onEdit,
  onMarkHelped,
  onPreviewPhoto,
  post,
}: EmergencyCardProps) => {
  if (!post) {
    return (
      <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="p-4">
          <div className="mb-4 h-32 rounded-md bg-slate-200" />

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="h-5 w-32 rounded bg-slate-200" />
              <div className="mt-2 h-3 w-44 rounded bg-slate-100" />
            </div>

            <div className="h-6 w-16 rounded-md bg-slate-100" />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="h-6 w-14 rounded-md bg-slate-100" />
            <div className="h-6 w-20 rounded-md bg-slate-100" />
          </div>

          <div className="mt-3 h-4 w-40 rounded bg-slate-100" />
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          <div className="h-3 w-20 rounded bg-slate-100" />
          <div className="h-3 w-12 rounded bg-slate-100" />
        </div>
      </article>
    );
  }

  return (
    <article className="flex min-h-[390px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-1 flex-col p-4">
        {post.photoUrl ? (
          <button
            className="mb-4 block h-32 w-full overflow-hidden rounded-md"
            onClick={() => onPreviewPhoto?.(post.photoUrl ?? "")}
            type="button"
          >
            <img className="h-full w-full object-cover" src={post.photoUrl} alt="" />
          </button>
        ) : (
          <div className="mb-4 h-32 rounded-md bg-slate-200" />
        )}

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="break-all text-lg font-bold leading-snug text-[#1D2A44]">{post.title}</h2>
            <p className="mt-2 break-all text-sm leading-snug text-[#1D2A44]">{post.need}</p>
          </div>

          <span className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold ${statusClassNames[post.status]}`}>
            {post.status}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${urgencyClassNames[post.urgency]}`}>
            {post.urgency}
          </span>
        </div>

        <div className="mt-5 grid flex-1 grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div className="min-w-0">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-2 text-sm font-semibold text-[#1D2A44]">
              <EmergencyIcon className="h-4 w-4 shrink-0" src={locationLogo} />
              <span className="break-all leading-snug">{post.location}</span>
            </div>
            <p className="mt-3 break-all text-sm leading-snug text-[#1D2A44]">{post.note || "No note added."}</p>
          </div>

          {post.isOwner && (
            <div className="flex w-28 shrink-0 flex-col items-end gap-2">
              <div className="flex gap-2">
                {post.status === "Open" && (
                  <button
                    className="flex h-9 w-11 items-center justify-center rounded-md border border-slate-200 bg-white shadow-sm transition hover:border-red-300 hover:ring-2 hover:ring-red-100"
                    onClick={() => onEdit?.(post)}
                    type="button"
                  >
                    <EmergencyIcon className="h-4 w-4" src={editLogo} />
                  </button>
                )}
                <button
                  className="flex h-9 w-11 items-center justify-center rounded-md border border-slate-200 bg-white shadow-sm transition hover:border-red-300 hover:ring-2 hover:ring-red-100"
                  onClick={() => onDelete?.(post.id)}
                  type="button"
                >
                  <EmergencyIcon className="h-4 w-4" src={trashLogo} />
                </button>
              </div>
              {post.status === "Open" && (
                <button
                  className="group h-9 w-28 rounded-md border border-green-200 bg-green-50 text-xs font-semibold text-green-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:ring-2 hover:ring-blue-100"
                  onClick={() => onMarkHelped?.(post.id)}
                  type="button"
                >
                  <span className="group-hover:hidden">Mark Helped</span>
                  <span className="hidden group-hover:inline">Helped</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 items-center border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
        <span className="min-w-0 break-all leading-snug">{post.contact}</span>
        <span className="text-center font-medium text-slate-400">{post.isOwner ? "Your Post" : ""}</span>
        <span className="text-right">{getPostTimeLabel(post.createdAt)}</span>
      </div>
    </article>
  );
};

export default EmergencyCard;
