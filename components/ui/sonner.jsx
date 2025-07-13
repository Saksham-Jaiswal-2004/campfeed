"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme === "system" ? "dark" : theme}
      className="toaster group"
      style={{
        "--normal-bg": "#1e1b4b", // deep indigo background
        "--normal-text": "#e0e7ff", // soft indigo-white text
        "--normal-border": "#3730a3",
      }}
      {...props}
    />
  );
};

export { Toaster };
