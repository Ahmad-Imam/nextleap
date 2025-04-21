"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart,
  Bookmark,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  PenTool,
  Search,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <motion.div
              className="flex flex-col justify-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Simplify Your Job Search with NextLeap
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Track applications, interviews, and land your dream job with
                  our all-in-one platform.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Link href="/dashboard">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  <Link href="/faq">Learn More</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative w-full h-[400px]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Briefcase className="h-24 w-24 text-primary" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 ">
        <div className="container px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Everything You Need to Land Your Dream Job
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl">
                NextLeap provides all the tools you need to organize your job
                search and track applications.
              </p>
            </div>
          </motion.div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-10">
            <motion.div
              className="grid gap-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5 }}
            >
              <FeatureCard
                icon={<BarChart className="h-10 w-10 text-primary" />}
                title="Track Applications"
                description="Keep track of all your job applications in one place. Add jobs via URL or manual entry."
              />
              <FeatureCard
                icon={<Calendar className="h-10 w-10 text-primary" />}
                title="Interview Reminders"
                description="Get reminders for upcoming interviews in the next 15 days."
              />
              <FeatureCard
                icon={<FileText className="h-10 w-10 text-primary" />}
                title="Resume Builder"
                description="Create and manage multiple resumes tailored to different job applications."
              />
            </motion.div>
            <motion.div
              className="grid gap-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FeatureCard
                icon={<Bookmark className="h-10 w-10 text-primary" />}
                title="Bookmark Jobs"
                description="Save interesting job postings to review later when you're ready to apply."
              />
              <FeatureCard
                icon={<PenTool className="h-10 w-10 text-primary" />}
                title="Cover Letter Generation"
                description="Generate customized cover letters based on job descriptions and your profile."
              />
              <FeatureCard
                icon={<CheckCircle className="h-10 w-10 text-primary" />}
                title="Application Status"
                description="Update and track the status of each application: applied, interviewing, selected, or rejected."
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                How NextLeap Works
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl">
                A simple process to streamline your job search journey
              </p>
            </div>
          </motion.div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
            <motion.div
              className="flex flex-col items-center text-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Find Jobs</h3>
                <p className="text-muted-foreground">
                  Discover opportunities and save them to your dashboard with a
                  single click
                </p>
              </div>
            </motion.div>
            <motion.div
              className="flex flex-col items-center text-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Apply with Ease</h3>
                <p className="text-muted-foreground">
                  Generate tailored resumes and cover letters for each
                  application
                </p>
              </div>
            </motion.div>
            <motion.div
              className="flex flex-col items-center text-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Track Progress</h3>
                <p className="text-muted-foreground">
                  Monitor application status and never miss an interview
                  opportunity
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-t ">
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
                Ready to Simplify Your Job Search?
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
              <Button variant="outline" size="lg">
                <Link href="/faq">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-2">
          {icon}
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
