import { useEffect, useState } from "react";
import API from "../services/api";
import { getCurrentUser, getStoredUser } from "../utils/auth";

function ProfileSettings() {
  const currentUser = getCurrentUser();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = getStoredUser();
    setFormData({
      name: stored.name || currentUser.name || "",
      email: stored.email || currentUser.email || "",
      phone: stored.phone || "",
      password: ""
    });
  }, [currentUser.email, currentUser.name]);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone
    };
    if (formData.password.trim()) payload.password = formData.password;

    try {
      const response = await API.put("/auth/update-profile", payload);
      const updatedUser = response.data?.user || payload;
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...getStoredUser(),
          ...updatedUser,
          role: currentUser.role || "student"
        })
      );
      setMessage("Profile updated successfully.");
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (error) {
      if (error.response?.status === 404) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...getStoredUser(),
            ...payload,
            role: currentUser.role || "student"
          })
        );
        setMessage("Profile updated locally. Backend profile API is not configured yet.");
        setFormData((prev) => ({ ...prev, password: "" }));
      } else {
        setMessage(error.response?.data?.message || "Failed to update profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm md:p-8">
      <h2 className="mb-1 text-2xl font-semibold text-slate-900">Profile Settings</h2>
      <p className="mb-6 text-sm text-slate-500">Update your personal information.</p>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">New Password (optional)</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      {message && (
        <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {message}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

export default ProfileSettings;
