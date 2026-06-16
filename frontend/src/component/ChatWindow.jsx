import React from "react";
import { motion } from "framer-motion";

const ChatWindow = ({ resetComponent }) => {
  return (
    <div className="hidden md:flex flex-1 bg-[#1D1F1F] items-center justify-center flex-col gap-4">
      <motion.h1
        className="text-3xl lg:text-5xl font-medium text-center px-4 text-white"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Your Chats are waiting!
      </motion.h1>
    </div>
  );
};

export default ChatWindow;
