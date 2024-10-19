import React from "react";
import { Button } from "@mui/joy";

interface WelcomeProps {
  onOpenDirectory: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onOpenDirectory }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">欢迎使用 BLinK</h1>
      <p className="text-xl mb-8 text-gray-600">开始您的知识管理之旅</p>
      <Button onClick={onOpenDirectory} variant="outlined" color="primary">
        设置目录
      </Button>
    </div>
  );
};

export default Welcome;
