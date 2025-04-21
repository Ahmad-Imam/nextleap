"use client";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

export default function FaqHeader() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-background">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
            <HelpCircle className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Find answers to common questions about NextLeap and how it can
              help with your job search.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
