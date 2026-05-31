import type { RefObject } from "react";

import type { ProfileInfo } from "../types/profile.type";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileEditControls } from "./ProfileEditControls";
import { CalendarIcon, LocationIcon, MailIcon, PhoneIcon } from "./ProfileIcons";
import { ProfileInfoRow } from "./ProfileInfoRow";
import { ProfileVerifiedBadge } from "./ProfileVerifiedBadge";

type ProfileCardProps = {
  draftProfile: ProfileInfo;
  initials: string;
  inputClass: string;
  isEditing: boolean;
  memberSince: string;
  onCancelEditing: () => void;
  onPhotoChange: (file: File | undefined) => void;
  onPhotoPickerOpen: () => void;
  onSaveProfile: () => void;
  onStartEditing: () => void;
  onUpdateDraft: (field: keyof ProfileInfo, value: string) => void;
  photoInputRef: RefObject<HTMLInputElement | null>;
  profile: ProfileInfo;
  visibleProfile: ProfileInfo;
};

export const ProfileCard = ({
  draftProfile,
  initials,
  inputClass,
  isEditing,
  memberSince,
  onCancelEditing,
  onPhotoChange,
  onPhotoPickerOpen,
  onSaveProfile,
  onStartEditing,
  onUpdateDraft,
  photoInputRef,
  profile,
  visibleProfile,
}: ProfileCardProps) => {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-6 md:grid-cols-[128px_minmax(0,1fr)]">
        <ProfileAvatar
          initials={initials}
          isEditing={isEditing}
          name={visibleProfile.name}
          onPhotoChange={onPhotoChange}
          onPhotoPickerOpen={onPhotoPickerOpen}
          photoInputRef={photoInputRef}
          profilePhotoUrl={visibleProfile.profilePhotoUrl}
        />

        <div className="min-w-0">
          <div>
            {isEditing ? <ProfileEditControls onCancel={onCancelEditing} onSave={onSaveProfile} /> : null}

            {isEditing ? (
              <input
                className={`${inputClass} max-w-sm text-2xl font-bold`}
                onChange={(event) => onUpdateDraft("name", event.target.value)}
                placeholder="Name"
                value={draftProfile.name}
              />
            ) : (
              <h2 className="text-2xl font-bold text-[#1F2A44]">{profile.name}</h2>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {!isEditing ? (
                <button
                  className="whitespace-nowrap rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#1F2A44] shadow-md transition hover:border-emerald-300 hover:bg-emerald-50 hover:ring-2 hover:ring-emerald-100"
                  onClick={onStartEditing}
                  type="button"
                >
                  Edit Profile
                </button>
              ) : null}

              {profile.isVerified ? <ProfileVerifiedBadge /> : null}
            </div>
          </div>

          <div className="mt-5 space-y-3 text-sm font-medium text-[#1F2A44]">
            <ProfileInfoRow icon={<CalendarIcon />}>Member since {memberSince}</ProfileInfoRow>
          </div>
        </div>
      </div>

      {isEditing ? (
        <textarea
          className={`${inputClass} mx-auto mt-6 block max-w-md resize-none whitespace-pre-wrap break-words text-center leading-snug`}
          onChange={(event) => onUpdateDraft("bio", event.target.value)}
          placeholder="Write a short note about yourself (optional)"
          rows={4}
          value={draftProfile.bio}
        />
      ) : (
        <p className="mx-auto mt-6 max-w-md whitespace-pre-wrap break-words text-center text-sm leading-snug text-[#1F2A44]">
          {profile.bio}
        </p>
      )}

      <div className="my-6 border-t border-slate-200" />

      <div className="mx-auto max-w-md space-y-3 text-left text-sm text-[#1F2A44]">
        <ProfileInfoRow icon={<PhoneIcon />}>
          {isEditing ? (
            <input
              className={inputClass}
              onChange={(event) => onUpdateDraft("phone", event.target.value)}
              placeholder="Number (optional)"
              value={draftProfile.phone}
            />
          ) : (
            profile.phone || "No number added"
          )}
        </ProfileInfoRow>

        <ProfileInfoRow icon={<MailIcon />}>
          {isEditing ? (
            <input
              className={inputClass}
              onChange={(event) => onUpdateDraft("email", event.target.value)}
              placeholder="Email"
              type="email"
              value={draftProfile.email}
            />
          ) : (
            profile.email
          )}
        </ProfileInfoRow>

        <ProfileInfoRow icon={<LocationIcon />}>
          {isEditing ? (
            <input
              className={inputClass}
              onChange={(event) => onUpdateDraft("location", event.target.value)}
              placeholder="Location (optional)"
              value={draftProfile.location}
            />
          ) : (
            profile.location || "No location added"
          )}
        </ProfileInfoRow>
      </div>
    </article>
  );
};
