import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState(null);

  // ✅ SAFE fallback (prevents crash)
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImg) {
      await updateProfile({ fullName: name, bio });
      navigate("/");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);

    reader.onload = async () => {
      const base64Image = reader.result;

      await updateProfile({
        profilePic: base64Image,
        fullName: name,
        bio,
      });

      navigate("/");
    };
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-4xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 rounded-lg flex justify-between items-center max-sm:flex-col-reverse">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-10 flex-1"
        >
          <h3 className="text-xl font-semibold text-white">Profile Details</h3>

          {/* Upload */}
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              type="file"
              id="avatar"
              hidden
              accept=".png,.jpg,.jpeg"
              onChange={(e) => setSelectedImg(e.target.files[0])}
            />

            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : assets.avatar_icon
              }
              alt="avatar"
              className="w-14 h-14 rounded-full object-cover border border-gray-500"
            />

            <span className="text-sm">Upload Profile Image</span>
          </label>

          {/* Name */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 bg-transparent border border-gray-500 rounded-md"
            placeholder="Your Name"
          />

          {/* Bio */}
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="p-3 bg-transparent border border-gray-500 rounded-md"
            placeholder="Write profile bio"
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white py-3 rounded-full"
          >
            Save
          </button>
        </form>

        {/* Right Image */}
        {/* Right Side Preview */}
        <div className="flex justify-center items-center p-10">
          <img
            src={
              selectedImg
                ? URL.createObjectURL(selectedImg)
                : authUser?.profilePic || assets.logo_icon
            }
            alt="Profile Preview"
            className="w-40 h-40 object-cover rounded-full border border-gray-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
