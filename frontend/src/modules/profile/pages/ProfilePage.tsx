import { useEffect, useRef, useState } from "react";

import { getMyProfile, updateMyProfile } from "../apis/profile.api";
import { ProfileCard } from "../components/ProfileCard";
import { ProfileReputationPanel } from "../components/ProfileReputationPanel";
import { ProfileStatsGrid } from "../components/ProfileStatsGrid";
import type { ProfileInfo } from "../types/profile.type";

const initialProfile: ProfileInfo = {
  bio: "Community volunteer focused on helping families access essential resources during emergencies.",
  email: "arjun.kumar@example.com",
  location: "Kathmandu",
  memberSince: "Jan 2023",
  name: "Arjun Kumar",
  phone: "98105430",
  profilePhotoUrl: "",
  reputationPoints: 1250,
};

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

export const ProfilePage = () => {
  const [profile, setProfile] = useState<ProfileInfo>(initialProfile);
  const [draftProfile, setDraftProfile] = useState<ProfileInfo>(initialProfile);
  const [profileError, setProfileError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);

  const visibleProfile = isEditing ? draftProfile : profile;
  const initials = getInitials(visibleProfile.name);

  const updateDraft = (field: keyof ProfileInfo, value: string) => {
    setDraftProfile((currentProfile) => ({
      ...currentProfile,
      [field]: value,
    }));
  };

  const startEditing = () => {
    setProfileError("");
    setDraftProfile(profile);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraftProfile(profile);
    setIsEditing(false);
  };

  const saveProfile = async () => {
    setProfileError("");

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
    } catch {
      setProfileError("Profile could not be saved. Please make sure you are logged in.");
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
      } catch {
        if (isActive) {
          setProfileError("Using demo profile until you log in.");
        }
      }
    };

    void loadProfile();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-6">
        <header>
          <h1 className="text-4xl font-bold text-[#1F2A44]">My Profile</h1>
          <p className="mt-4 text-base text-[#1F2A44]">Manage your account and update your preferences.</p>
          {profileError ? <p className="mt-3 text-sm font-semibold text-red-500">{profileError}</p> : null}
        </header>

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
            <ProfileReputationPanel reputationPoints={profile.reputationPoints} />
            <ProfileStatsGrid />
          </div>
        </section>
      </div>
    </main>
  );
};
