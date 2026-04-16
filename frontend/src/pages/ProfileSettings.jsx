import { useEffect, useState } from "react";
import API from "../services/api";

function ProfileSettings() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  // Load user data from token
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const user = JSON.parse(atob(token.split(".")[1]));

      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        phone: user.phone || ""
      });
    }
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 UPDATE PROFILE FUNCTION
  const handleUpdate = async () => {
    try {

      const res = await API.put("/auth/update-profile", formData);

      alert("Profile updated successfully");

      // Optional: update token again if backend sends new one
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">

      <div className="bg-white p-8 rounded shadow w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Profile Settings
        </h2>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full mb-4 p-2 border rounded"
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="New Password"
          className="w-full mb-4 p-2 border rounded"
        />

        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full mb-4 p-2 border rounded"
        />

        <button
          onClick={handleUpdate}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Update Profile
        </button>

      </div>

    </div>
  );
}

export default ProfileSettings;