import { useState } from "react";

import EmergencyDeleteConfirm from "../components/EmergencyDeleteConfirm";
import EmergencyFilters from "../components/EmergencyFilters";
import type { EmergencyFilterValues } from "../components/EmergencyFilters";
import EmergencyForm from "../components/EmergencyForm";
import EmergencyHeader from "../components/EmergencyHeader";
import EmergencyList from "../components/EmergencyList";
import EmergencyPhotoPreview from "../components/EmergencyPhotoPreview";
import type { EmergencyPost } from "../types/emergency.type";

const demoPosts: EmergencyPost[] = [
  {
    contact: "9801234567",
    id: "demo-medicine",
    isOwner: false,
    location: "Kathmandu, Bagmati",
    need: "Flu medicine for baby",
    note: "I need flu medicine for my baby.",
    status: "Open",
    title: "Medicine (flu)",
    urgency: "Urgent",
  },
  {
    contact: "9841122334",
    id: "demo-blankets",
    isOwner: false,
    location: "Anywhere, everywhere",
    need: "Warm blankets",
    note: "I have a newborn and it's currently snowing.",
    status: "Helped",
    title: "Warm Blankets",
    urgency: "Medium",
  },
  {
    contact: "9812345678",
    id: "demo-clothes",
    isOwner: false,
    location: "Amanduy Orphanage Organization",
    need: "Clothes for children",
    note: "We ran out proper clothes for orphanage.",
    status: "Open",
    title: "Clothes",
    urgency: "Low",
  },
];

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
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);
  const [posts, setPosts] = useState<EmergencyPost[]>(demoPosts);
  const locationOptions = getLocationOptions(posts);
  const filteredPosts = getFilteredPosts(posts, filters);

  const closeForm = () => {
    setEditingPost(null);
    setIsFormOpen(false);
  };

  const savePost = (post: EmergencyPost) => {
    setPosts((current) => {
      const existingPost = current.some((item) => item.id === post.id);

      if (existingPost) {
        return current.map((item) => (item.id === post.id ? post : item));
      }

      return [post, ...current];
    });
  };

  const startEditPost = (post: EmergencyPost) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const markPostHelped = (postId: string) => {
    setPosts((current) =>
      current.map((post) => (post.id === postId ? { ...post, status: "Helped" } : post)),
    );
  };

  const confirmDeletePost = () => {
    if (!deletePostId) {
      return;
    }

    setPosts((current) => current.filter((post) => post.id !== deletePostId));
    setDeletePostId(null);
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
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
            <EmergencyForm
              editingPost={editingPost}
              onClose={closeForm}
              onSubmit={savePost}
            />
          </div>
        )}
        <div className="mt-7">
          <EmergencyList
            onDeletePost={setDeletePostId}
            onEditPost={startEditPost}
            onMarkHelped={markPostHelped}
            onPreviewPhoto={setPreviewPhotoUrl}
            posts={filteredPosts}
          />
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
