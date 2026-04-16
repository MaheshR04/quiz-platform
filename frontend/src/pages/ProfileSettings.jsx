import { User, Mail, Lock, Phone } from "lucide-react";

export default function ProfileSettings() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      {/* Card */}
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6">
          Profile Settings
        </h2>

        {/* Form */}
        <div className="space-y-4">

          {/* Username */}
          <div className="flex items-center border rounded-lg px-3 py-2">
            <User className="text-gray-400 mr-2" size={18} />
            <input
              type="text"
              placeholder="Username"
              className="w-full outline-none"
            />
          </div>

          {/* Email */}
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Mail className="text-gray-400 mr-2" size={18} />
            <input
              type="email"
              placeholder="Email"
              className="w-full outline-none"
            />
          </div>

          {/* Password */}
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Lock className="text-gray-400 mr-2" size={18} />
            <input
              type="password"
              placeholder="Password"
              className="w-full outline-none"
            />
          </div>

          {/* Phone */}
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Phone className="text-gray-400 mr-2" size={18} />
            <input
              type="text"
              placeholder="Phone Number"
              className="w-full outline-none"
            />
          </div>

          {/* Button */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition">
            Update Profile
          </button>

        </div>
      </div>
    </div>
  );
}