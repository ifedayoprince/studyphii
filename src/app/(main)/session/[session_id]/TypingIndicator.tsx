import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex gap-1 p-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-default-300"
          animate={{
            y: ["0%", "-50%", "0%"],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
