type EmergencyIconProps = {
  className?: string;
  src: string;
};

const EmergencyIcon = ({ className = "h-4 w-4", src }: EmergencyIconProps) => {
  return <img className={className} src={src} alt="" />;
};

export default EmergencyIcon;
