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

                <AccordionItem value="item-2">
                  <AccordionTrigger>Is NextLeap free to use?</AccordionTrigger>
                  <AccordionContent>
                    NextLeap offers a free tier that includes basic job tracking
                    and application management features. We also offer premium
                    plans with advanced features like AI cover letter
                    generation, unlimited resume storage, and detailed
                    analytics. Check our pricing page for more details on each
                    plan.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    How secure is my data on NextLeap?
                  </AccordionTrigger>
                  <AccordionContent>
                    We take data security very seriously. All your personal
                    information, resumes, and job application details are
                    encrypted and stored securely. We never share your data with
                    third parties without your explicit consent. You can review
                    our privacy policy for more details on how we protect your
                    information.
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
                    Both options are available from your dashboard by clicking
                    the "Add Job" button.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    How do I update the status of my application?
                  </AccordionTrigger>
                  <AccordionContent>
                    To update the status of your application, navigate to the
                    specific job entry in your dashboard and click on the status
                    dropdown. You can select from options like "Applied,"
                    "Interview Scheduled," "Selected," or "Rejected." For
                    interview stages, you can also add dates to keep track of
                    your schedule.
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
                    and manage multiple versions of your resume. Click "Create
                    New Resume" to start from scratch or duplicate an existing
                    one to make modifications. You can tailor each resume to
                    different job types or industries to increase your chances
                    of success.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    How does the interview tracking feature work?
                  </AccordionTrigger>
                  <AccordionContent>
                    When you update a job application status to "Interview," you
                    can add the interview date, time, and any notes. These
                    interviews will appear in your "Upcoming Interviews" section
                    on the dashboard, showing all interviews scheduled within
                    the next 15 days. You'll also receive email reminders before
                    each interview.
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
                    Google or LinkedIn account for faster registration.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    Can I export my job application data?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, you can export all your job application data in CSV or
                    PDF format. This is useful for keeping offline records or
                    sharing your job search progress with a career coach. To
                    export your data, go to your account settings and select the
                    "Export Data" option.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    How do I upgrade or downgrade my subscription?
                  </AccordionTrigger>
                  <AccordionContent>
                    To change your subscription plan, go to your account
                    settings and select the "Subscription" tab. From there, you
                    can view available plans and make changes to your current
                    subscription. Changes will take effect at the start of your
                    next billing cycle.
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
