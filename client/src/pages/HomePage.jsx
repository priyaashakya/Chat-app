import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import { useContext, useState } from "react";
import bgImage from "../assets/bgImage.svg";
import { ChatContext } from "../context/ChatContext";

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div
      className="w-full h-screen flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div
        className={`w-full h-full max-w-6xl border border-gray-600 rounded-2xl overflow-hidden grid backdrop-blur-xl min-h-0 ${
          selectedUser
            ? "md:grid-cols-[1fr_1.5fr_1fr]"
            : "md:grid-cols-[1fr_2fr]"
        }`}
      >
        {/* Sidebar */}
        <Sidebar />

        {/* Chat */}
        <ChatContainer />

        {/* Right Sidebar */}
        {selectedUser && <RightSidebar />}
      </div>
    </div>
  );
};

export default HomePage;
