"use client";
import { toast } from "sonner";
import { IoShareSocial } from "react-icons/io5";

export default function ShareButton({ title, url, text = "" }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text || title,
          url: url || window.location.href,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        toast.error("Share cancelled or failed.");
      }
    } else {
      await navigator.clipboard.writeText(url || window.location.href);
      toast.info("Link copied to clipboard!");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="text-sm px-4 py-3 border border-gray-700 hover:bg-gray-700/20 rounded-md contentText transition-all duration-200 ease-in-out"
    >
      <IoShareSocial />
    </button>
  );
}