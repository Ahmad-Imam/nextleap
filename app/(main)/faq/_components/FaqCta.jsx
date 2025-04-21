"use client";
import { motion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";
export default function FaqCTA() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 border-t">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Ready to Take Control of Your Job Search?
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Join thousands of job seekers who have streamlined their job
              search with NextLeap.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Link href={"/sign-up"}>Sign Up Free</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/">Learn More</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
