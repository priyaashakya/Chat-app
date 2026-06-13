import assets from "../assets/assets";
import { useContext, useEffect, useRef, useState } from "react";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);

  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef(null);
  const [input, setInput] = useState("");

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();

    if (!input.trim()) return;

    await sendMessage({
      text: input.trim(),
    });

    setInput("");
  };

  // Send Image
  const handleSendImage = async (e) => {
    const file = e.target.files[0];

    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      await sendMessage({
        image: reader.result,
      });

      e.target.value = "";
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  return selectedUser ? (
    <div className="h-full flex flex-col min-h-0 relative backdrop-blur-lg">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 px-4 border-b border-stone-500">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt={selectedUser?.fullName}
          className="w-8 h-8 rounded-full"
        />

        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser?.fullName}

          {onlineUsers?.includes(selectedUser?._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="Back"
          className="md:hidden max-w-7 cursor-pointer"
        />

        <img
          src={assets.help_icon}
          alt="Help"
          className="max-md:hidden max-w-5"
        />
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 pb-24 chat-scroll">
        {messages?.map((msg, index) => {
          const isCurrentUser = msg.senderId === authUser?._id;

          return (
            <div
              key={index}
              className={`flex items-end gap-2 mb-4 ${
                isCurrentUser ? "justify-end" : "flex-row-reverse justify-end"
              }`}
            >
              {msg.image ? (
                <img
                  src={msg.image}
                  alt="Shared"
                  className="max-w-[230px] rounded-lg"
                />
              ) : (
                <p
                  className={`p-2 max-w-[200px] md:text-sm font-light break-all text-white bg-violet-500/30 rounded-lg ${
                    isCurrentUser ? "rounded-br-none" : "rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </p>
              )}

              <div className="text-center text-xs">
                <img
                  src={
                    isCurrentUser
                      ? authUser?.profilePic || assets.avatar_icon
                      : selectedUser?.profilePic || assets.avatar_icon
                  }
                  alt=""
                  className="w-7 h-7 rounded-full"
                />

                <p className="text-gray-500">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={scrollEnd}></div>
      </div>

      {/* Input */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/10 px-3 rounded-full">
          <input
            type="text"
            value={input}
            placeholder="Send a message"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
            className="flex-1 bg-transparent text-sm p-3 outline-none text-white placeholder-gray-400"
          />

          <input
            type="file"
            id="image"
            hidden
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleSendImage}
          />

          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt="Upload"
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>

        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt="Send"
          className="w-7 cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-400 bg-white/10 max-md:hidden h-full">
      <img src={assets.logo_icon} alt="Logo" className="max-w-16" />

      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
