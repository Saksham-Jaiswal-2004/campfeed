"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

export default function LikeButton({
  initialLiked = false,
  initialCount = 248,
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [burstKey, setBurstKey] = useState(0);

  const handleClick = () => {
    setLiked((prev) => !prev);
    setCount((prev) => (liked ? prev - 1 : prev + 1));

    if (!liked) {
      setBurstKey((prev) => prev + 1);
    }
  };

  const particles = [
    { x: 0, y: -28 },
    { x: 20, y: -18 },
    { x: 28, y: 0 },
    { x: 20, y: 18 },
    { x: 0, y: 28 },
    { x: -20, y: 18 },
    { x: -28, y: 0 },
    { x: -20, y: -18 },
  ];

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleClick}
        className="relative flex h-12 w-12 items-center justify-center rounded-full"
      >
        {/* soft ripple */}
        <AnimatePresence>
          {liked && (
            <motion.div
              initial={{
                scale: 0,
                opacity: 0.35,
              }}
              animate={{
                scale: 2.5,
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
              className="absolute h-full w-full rounded-full bg-red-200"
            />
          )}
        </AnimatePresence>

        {/* particles */}
        <AnimatePresence>
          {!liked
            ? null
            : particles.map((p, i) => (
                <motion.div
                  key={`${burstKey}-${i}`}
                  initial={{
                    opacity: 1,
                    scale: 0,
                    x: 0,
                    y: 0,
                  }}
                  animate={{
                    opacity: 0,
                    scale: [0, 1, 0],
                    x: p.x,
                    y: p.y,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: i * 0.015,
                  }}
                  className="absolute h-1.5 w-1.5 rounded-full bg-red-500"
                />
              ))}
        </AnimatePresence>

        {/* glow */}
        <motion.div
          animate={{
            boxShadow: liked
              ? [
                  "0 0 0px rgba(239,68,68,0)",
                  "0 0 25px rgba(239,68,68,.5)",
                  "0 0 10px rgba(239,68,68,.2)",
                ]
              : "0 0 0px rgba(0,0,0,0)",
          }}
          transition={{
            duration: 0.5,
          }}
          className="absolute inset-0 rounded-full"
        />

        {/* heart */}
        <motion.div
          whileTap={{
            scale: 0.85,
          }}
          animate={{
            scale: liked
              ? [1, 1.35, 0.95, 1]
              : [1, 0.92, 1],
          }}
          transition={{
            type: "spring",
            stiffness: 550,
            damping: 16,
            mass: 0.7,
          }}
        >
          <Heart
            size={28}
            className={`transition-all duration-300 ${
              liked
                ? "fill-red-500 text-red-500"
                : "text-gray-400"
            }`}
          />
        </motion.div>
      </button>

      {/* count */}
      <div className="relative h-6 w-10 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            initial={{
              opacity: 0,
              y: liked ? 10 : -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: liked ? -10 : 10,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className="absolute font-medium text-gray-700"
          >
            {count}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}