import { useCallback, useEffect, useState } from "react";

import {
  createEmergency,
  deleteEmergency,
  getEmergencies,
  markEmergencyHelped,
  updateEmergency,
} from "../apis/emergency.api";
import { LoadingState, ErrorState } from "../../../components/StateViews";
import EmergencyDeleteConfirm from "../components/EmergencyDeleteConfirm";
import EmergencyFilters from "../components/EmergencyFilters";
import type { EmergencyFilterValues } from "../components/EmergencyFilters";
import EmergencyForm from "../components/EmergencyForm";
import EmergencyHeader from "../components/EmergencyHeader";
import EmergencyList from "../components/EmergencyList";
import EmergencyPhotoPreview from "../components/EmergencyPhotoPreview";
import type { EmergencyFormPayload, EmergencyPost } from "../types/emergency.type";

const initialFilters: EmergencyFilterValues = {
  location: "All Locations",
  search: "",
  status: "All Status",
  urgency: "All Levels",
};

const normalizeFilterText = (value: string) => value.trim().toLowerCase();

const getLocationOptions = (posts: EmergencyPost[]) => {
  const locationMap = new Map<string, string>();

  posts.forEach((post) => {
    const normalizedLocation = normalizeFilterText(post.location);

    if (normalizedLocation && !locationMap.has(normalizedLocation)) {
      locationMap.set(normalizedLocation, post.location);
    }
  });

  return [...locationMap.values()].sort((first, second) => first.localeCompare(second));
};

const getFilteredPosts = (posts: EmergencyPost[], filters: EmergencyFilterValues) => {
  const normalizedSearch = normalizeFilterText(filters.search);
  const normalizedLocation = normalizeFilterText(filters.location);

  return posts.filter((post) => {
    const matchesSearch =
      !normalizedSearch ||
      [post.title, post.need, post.location, post.note, post.contact]
        .map(normalizeFilterText)
        .some((value) => value.includes(normalizedSearch));
    const matchesLocation =
      filters.location === "All Locations" ||
      normalizeFilterText(post.location) === normalizedLocation;
    const matchesUrgency = filters.urgency === "All Levels" || post.urgency === filters.urgency;
    const matchesStatus = filters.status === "All Status" || post.status === filters.status;

    return matchesSearch && matchesLocation && matchesUrgency && matchesStatus;
  });
};

const EmergencyPage = () => {
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<EmergencyPost | null>(null);
  const [filters, setFilters] = useState<EmergencyFilterValues>(initialFilters);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);
  const [posts, setPosts] = useState<EmergencyPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const locationOptions = getLocationOptions(posts);
  const filteredPosts = getFilteredPosts(posts, filters);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      setPosts(await getEmergencies());
    } catch {
      setLoadError("Could not load emergency requests.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const closeForm = () => {
    setEditingPost(null);
    setIsFormOpen(false);
  };

  const savePost = async (payload: EmergencyFormPayload) => {
    try {
      setSubmissionError(null);
      const savedPost = editingPost
        ? await updateEmergency(editingPost.id, payload)
        : await createEmergency(payload);

      setPosts((current) => {
        const existingPost = current.some((item) => item.id === savedPost.id);

        if (existingPost) {
          return current.map((item) => (item.id === savedPost.id ? savedPost : item));
        }

        return [savedPost, ...current];
      });
      closeForm();
    } catch (error: unknown) {
      // try to read message from API response
      const errResp = error as { response?: { data?: { message?: string } } };
      const message = errResp?.response?.data?.message || (error instanceof Error ? error.message : "Failed to save emergency");
      setSubmissionError(String(message));
      console.error("Save post error:", error);
    }
  };

  const startEditPost = (post: EmergencyPost) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const markPostHelped = async (postId: string) => {
    const helpedPost = await markEmergencyHelped(postId);

    setPosts((current) =>
      current.map((post) => (post.id === postId ? helpedPost : post)),
    );
  };

  const confirmDeletePost = async () => {
    if (!deletePostId) {
      return;
    }

    await deleteEmergency(deletePostId);
    setPosts((current) => current.filter((post) => post.id !== deletePostId));
    setDeletePostId(null);
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <EmergencyHeader
          onAddEmergency={() => {
            setEditingPost(null);
            setIsFormOpen((current) => !current);
          }}
        />
        <div className="mt-8">
          <EmergencyFilters
            locationOptions={locationOptions}
            onChange={setFilters}
            values={filters}
          />
        </div>
        {isFormOpen && (
          <div className="mt-7">
            {submissionError && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {submissionError}
              </div>
            )}
            <EmergencyForm
              key={editingPost?.id ?? "new"}
              editingPost={editingPost}
              onClose={closeForm}
              onSubmit={savePost}
            />
          </div>
        )}
        <div className="mt-7">
          {isLoading ? (
            <LoadingState label="Loading requests…" />
          ) : loadError ? (
            <ErrorState message={loadError} onRetry={() => void loadPosts()} />
          ) : (
            <EmergencyList
              onDeletePost={setDeletePostId}
              onEditPost={startEditPost}
              onMarkHelped={markPostHelped}
              onPreviewPhoto={setPreviewPhotoUrl}
              posts={filteredPosts}
            />
          )}
        </div>
      </div>
      {deletePostId && (
        <EmergencyDeleteConfirm
          onCancel={() => setDeletePostId(null)}
          onConfirm={confirmDeletePost}
        />
      )}
      {previewPhotoUrl && (
        <EmergencyPhotoPreview
          onClose={() => setPreviewPhotoUrl(null)}
          photoUrl={previewPhotoUrl}
        />
      )}
    </div>
  );
};

export default EmergencyPage;
