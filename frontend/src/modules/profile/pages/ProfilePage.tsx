import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ZodError } from "zod";

import { useAuth } from "../../../auth/AuthContext";
import { getMyProfile, updateMyProfile } from "../apis/profile.api";
import { ProfileCard } from "../components/ProfileCard";
import { ProfileReputationPanel } from "../components/ProfileReputationPanel";
import { ProfileStatsGrid } from "../components/ProfileStatsGrid";
import type { ProfileInfo } from "../types/profile.type";

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base font-medium text-[#1F2A44] shadow-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100";

const getInitials = (name: string) => {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return initials || "AK";
};

const getProfileValidationMessage = (profile: ProfileInfo) => {
  if (!profile.name.trim()) {
    return "Name is required.";
  }

  if (!profile.email.trim()) {
    return "Email is required.";
  }

  return "";
};

const getProfileSaveErrorMessage = (error: unknown) => {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Profile input is invalid.";
  }

  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { issues?: { message?: string }[]; message?: string } | undefined;

    if (data?.issues?.[0]?.message) {
      return data.issues[0].message;
    }

    if (data?.message) {
      return data.message;
    }
  }

  return "Profile could not be saved. Please check the fields and try again.";
};

export const ProfilePage = () => {
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [draftProfile, setDraftProfile] = useState<ProfileInfo | null>(null);
  const [profileError, setProfileError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { logout: logoutSession, setUser, refresh } = useAuth();
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);

  const visibleProfile = isEditing ? draftProfile : profile;
  const initials = getInitials(visibleProfile?.name ?? "");

  const updateDraft = (field: keyof ProfileInfo, value: string) => {
    if (!draftProfile) {
      return;
    }

    setDraftProfile((currentProfile) => ({
      ...currentProfile!,
      [field]: value,
    }));
  };

  const startEditing = () => {
    if (!profile) {
      return;
    }

    setProfileError("");
    setDraftProfile(profile);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    if (!profile) {
      return;
    }

    setDraftProfile(profile);
    setIsEditing(false);
  };

  const saveProfile = async () => {
    if (!draftProfile) {
      return;
    }

    setProfileError("");

    const validationMessage = getProfileValidationMessage(draftProfile);
    if (validationMessage) {
      setProfileError(validationMessage);
      return;
    }

    try {
      const savedProfile = await updateMyProfile({
        bio: draftProfile.bio,
        email: draftProfile.email,
        location: draftProfile.location,
        name: draftProfile.name,
        phone: draftProfile.phone,
        profilePhotoUrl: draftProfile.profilePhotoUrl,
      });

      setProfile(savedProfile);
      setDraftProfile(savedProfile);
      setIsEditing(false);
      // Re-sync the global session so the navbar (and anything else reading
      // `useAuth().user`) reflects the renamed account instead of going stale.
      await refresh();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setUser(null);
        navigate("/login", { replace: true });
        return;
      }

      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setProfileError("Name or email is already used by another account.");
        return;
      }

      setProfileError(getProfileSaveErrorMessage(error));
    }
  };

  const openProfilePhotoPicker = () => {
    if (!isEditing) {
      return;
    }

    profilePhotoInputRef.current?.click();
  };

  const updateProfilePhoto = (file: File | undefined) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateDraft("profilePhotoUrl", reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = async () => {
    setProfileError("");

    try {
      await logoutSession();
      navigate("/login", { replace: true });
    } catch {
      setProfileError("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    let isActive = true;

    const loadProfile = async () => {
      try {
        const loadedProfile = await getMyProfile();

        if (isActive) {
          setProfile(loadedProfile);
          setDraftProfile(loadedProfile);
          setProfileError("");
        }
      } catch (error) {
        if (isActive) {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            setUser(null);
            navigate("/login", { replace: true });
            return;
          }

          setProfileError("Profile could not be loaded. Please try again.");
        }
      }
    };

    void loadProfile();

    return () => {
      isActive = false;
    };
  }, [navigate, setUser]);

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-6">
        <header className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-[#1F2A44]">My Profile</h1>
            <p className="mt-4 text-base text-[#1F2A44]">Manage your account and update your preferences.</p>
            {profileError ? <p className="mt-3 text-sm font-semibold text-red-500">{profileError}</p> : null}
          </div>

          {profile ? (
            <button
              className="mt-2 rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50 hover:ring-2 hover:ring-red-100"
              onClick={handleLogout}
              type="button"
            >
              Log Out
            </button>
          ) : null}
        </header>

        {profile && draftProfile && visibleProfile ? (
          <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.95fr)]">
            <ProfileCard
              draftProfile={draftProfile}
              initials={initials}
              inputClass={inputClass}
              isEditing={isEditing}
              memberSince={profile.memberSince}
              onCancelEditing={cancelEditing}
              onPhotoChange={updateProfilePhoto}
              onPhotoPickerOpen={openProfilePhotoPicker}
              onSaveProfile={saveProfile}
              onStartEditing={startEditing}
              onUpdateDraft={updateDraft}
              photoInputRef={profilePhotoInputRef}
              profile={profile}
              visibleProfile={visibleProfile}
            />

            <div className="space-y-8">
              <ProfileReputationPanel isVerified={profile.isVerified} reputationPoints={profile.reputationPoints} />
              <ProfileStatsGrid stats={profile.stats} />
            </div>
          </section>
        ) : (
          <div className="mt-8 rounded-lg border border-slate-200 bg-white px-6 py-8 text-sm font-medium text-slate-500 shadow-sm">
            Loading profile...
          </div>
        )}
      </div>
    </main>
  );
};
