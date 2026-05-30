import EmergencyActionButton from "./EmergencyActionButton";
import emergencyLogo from "../assets/EmergencyLogo.png";
import { PlusIcon } from "./EmergencySvgIcons";

type EmergencyHeaderProps = {
  onAddEmergency: () => void;
};

const EmergencyHeader = ({ onAddEmergency }: EmergencyHeaderProps) => {
  return (
    <section className="flex items-start justify-between gap-6">
      <div className="flex items-center gap-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm">
          <img className="h-13 w-13 object-contain" src={emergencyLogo} alt="" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-800">Emergency Request</h1>
          <p className="mt-1 text-sm text-slate-600">Ask for help or help people in need</p>
        </div>
      </div>

      <EmergencyActionButton icon={<PlusIcon className="h-3.5 w-3.5" />} label="Add Emergency" onClick={onAddEmergency} />
    </section>
  );
};

export default EmergencyHeader;
