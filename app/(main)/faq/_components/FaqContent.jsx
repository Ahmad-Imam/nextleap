"use client";

import { motion } from "framer-motion";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export default function FaqContent() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <motion.div
          className="mx-auto max-w-4xl space-y-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="mt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is NextLeap?</AccordionTrigger>
                  <AccordionContent>
                    NextLeap is a comprehensive job application tracking
                    platform that helps you organize your job search. It allows
                    you to track applications, manage interviews, create
                    resumes, generate cover letters, and more, all in one place.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            {/* Applications Tab */}
            <TabsContent value="applications" className="mt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    How do I add a new job application?
                  </AccordionTrigger>
                  <AccordionContent>
                    You can add a new job application in two ways:
                    <ol className="list-decimal pl-5 mt-2 space-y-1">
                      <li>
                        Paste the job posting URL and we'll automatically
                        extract the relevant information
                      </li>
                      <li>
                        Manually enter the job details including company,
                        position, and description
                      </li>
                    </ol>
                    Both options are available from your dashboard by going to
                    the "Create Job" page.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    How do I update the status of my application?
                  </AccordionTrigger>
                  <AccordionContent>
                    To update the status of your application, navigate to the
                    specific job entry in your dashboard and click on the status
                    buttons. You can select options like "Applied," "Interview,"
                    "Selected," or "Rejected." For interview stages, you can
                    also add dates to keep track of your schedule.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    Can I bookmark jobs to apply later?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, you can bookmark any job posting you're interested in
                    but not ready to apply for yet. These bookmarked jobs will
                    appear in a dedicated section of your dashboard, making it
                    easy to find and apply to them when you're ready.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    How do I generate a cover letter?
                  </AccordionTrigger>
                  <AccordionContent>
                    To generate a cover letter, go to the job application you
                    want to apply for and click the "Generate Cover Letter"
                    button. It will create a customized cover letter based on
                    the job and your user profile.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="mt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    Can I generate cover letters for different jobs?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes! NextLeap's cover letter generator creates customized
                    cover letters based on the job description and your profile.
                    Navigate to the job application you're interested in, click
                    "Generate Cover Letter," and our AI will create a tailored
                    letter highlighting your relevant skills and experience for
                    that specific position.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    How do I create and manage multiple resumes?
                  </AccordionTrigger>
                  <AccordionContent>
                    In the "Resumes" section of your dashboard, you can create
                    and manage multiple versions of your resume. Click "Resume
                    Builder" to start creating. You can choose to start from
                    your profile or use last created resume as a template You
                    can tailor each resume to different job types or industries
                    to increase your chances of success and save them for later
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    How does the interview tracking feature work?
                  </AccordionTrigger>
                  <AccordionContent>
                    When you update a job application status to "Interview," you
                    can add the interview date. These interviews will appear in
                    your "Upcoming Interviews" section on the dashboard, showing
                    all interviews scheduled within the next 15 days.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account" className="mt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    How do I create an account?
                  </AccordionTrigger>
                  <AccordionContent>
                    Creating an account is simple. Click the "Sign Up" button in
                    the top right corner of the page, enter your email address
                    and create a password. You can also sign up using your
                    Google account for faster registration.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
