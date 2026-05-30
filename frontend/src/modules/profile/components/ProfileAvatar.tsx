import type { RefObject } from "react";

import { CameraIcon } from "./ProfileIcons";

type ProfileAvatarProps = {
  initials: string;
  isEditing: boolean;
  name: string;
  onPhotoChange: (file: File | undefined) => void;
  onPhotoPickerOpen: () => void;
  photoInputRef: RefObject<HTMLInputElement | null>;
  profilePhotoUrl: string;
};

export const ProfileAvatar = ({
  initials,
  isEditing,
  name,
  onPhotoChange,
  onPhotoPickerOpen,
  photoInputRef,
  profilePhotoUrl,
}: ProfileAvatarProps) => {
  return (
    <div className="relative mx-auto h-40 w-40 rounded-full bg-emerald-100">
      {profilePhotoUrl ? (
        <img alt={`${name} profile`} className="h-full w-full rounded-full object-cover" src={profilePhotoUrl} />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-6xl font-bold text-[#1F2A44]">{initials}</div>
      )}
      {isEditing ? (
        <>
          <button
            className="absolute bottom-3 right-0 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-[#1F2A44] text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#263657] hover:shadow-lg hover:ring-2 hover:ring-emerald-100"
            onClick={onPhotoPickerOpen}
            type="button"
          >
            <CameraIcon />
          </button>
          <input
            accept="image/*"
            className="hidden"
            onChange={(event) => onPhotoChange(event.target.files?.[0])}
            ref={photoInputRef}
            type="file"
          />
        </>
      ) : null}
    </div>
  );
};
