import { GraduationCap, ShieldCheck } from "lucide-react";

const ROLES = [
  {
    value: "student",
    label: "Student",
    icon: GraduationCap
  },
  {
    value: "admin",
    label: "Admin",
    icon: ShieldCheck
  }
];

function RoleDropSelector({ value, onChange }) {
  const selectedRole = ROLES.find((role) => role.value === value) || ROLES[0];
  const SelectedIcon = selectedRole.icon;

  const handleDrop = (event) => {
    event.preventDefault();
    const nextRole = event.dataTransfer.getData("text/plain");

    if (ROLES.some((role) => role.value === nextRole)) {
      onChange(nextRole);
    }
  };

  return (
    <div className="mb-4">
      <label className="mb-2 block text-sm font-medium text-slate-700">Choose role</label>

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className="mb-3 flex min-h-16 items-center justify-between rounded-xl border border-dashed border-teal-300 bg-teal-50/70 px-4 py-3 text-teal-800"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white p-2 shadow-sm">
            <SelectedIcon size={18} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">Selected</p>
            <p className="font-semibold">{selectedRole.label}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ROLES.map((role) => {
          const Icon = role.icon;
          const isSelected = value === role.value;

          return (
            <button
              key={role.value}
              type="button"
              draggable
              onDragStart={(event) => event.dataTransfer.setData("text/plain", role.value)}
              onClick={() => onChange(role.value)}
              className={`flex cursor-grab items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition active:cursor-grabbing ${
                isSelected
                  ? "border-teal-600 bg-teal-600 text-white shadow-lg shadow-teal-600/20"
                  : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50"
              }`}
            >
              <Icon size={17} />
              {role.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default RoleDropSelector;
