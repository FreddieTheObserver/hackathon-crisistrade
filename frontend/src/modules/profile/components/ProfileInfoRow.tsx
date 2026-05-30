import type { ReactNode } from "react";

type ProfileInfoRowProps = {
  children: ReactNode;
  icon: ReactNode;
};

export const ProfileInfoRow = ({ children, icon }: ProfileInfoRowProps) => {
  return (
    <p className="flex items-center gap-3">
      <span className="h-5 w-5 shrink-0">{icon}</span>
      {children}
    </p>
  );
};
