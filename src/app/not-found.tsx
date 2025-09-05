"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => (prev + 1) % 360);
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-md text-center space-y-8">
        <div className="space-y-2">
          <motion.div
            className="relative mx-auto"
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1, 1, 0], rotate: [0, 0, 180, 180] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                times: [0, 0.2, 0.8, 1],
                ease: "easeInOut",
              }}
            >
              <div className="text-9xl font-extrabold text-primary opacity-20">
                4
              </div>
            </motion.div>

            <motion.div
              className="flex items-center justify-center w-40 h-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="relative w-32 h-32"
                animate={{
                  rotate: count,
                }}
              >
                <motion.div
                  className="absolute w-full h-full rounded-full border-8 border-primary/30"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
                <motion.div
                  className="absolute top-0 left-1/2 w-4 h-4 -ml-2 -mt-2 bg-primary rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1, 1, 0], rotate: [0, 0, -180, -180] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                delay: 2,
                times: [0, 0.2, 0.8, 1],
                ease: "easeInOut",
              }}
            >
              <div className="text-9xl font-extrabold text-primary opacity-20">
                4
              </div>
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            404
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Oops! Page not found
          </motion.p>
        </div>

        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
         Oops! Looks like you\’ve taken a wrong turn. Let\’s get you back home where everything makes sense.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button asChild>
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
