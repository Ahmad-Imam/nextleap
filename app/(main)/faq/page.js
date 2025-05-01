import FaqContent from "./_components/FaqContent";
import FaqCTA from "./_components/FaqCta";
import FaqHeader from "./_components/FaqHeader";

export const metadata = {
  title: "NextStep - FAQ",
  description: "Frequently Asked Questions",
};

export default function FAQPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full ">
      {/* Header */}
      <FaqHeader />

      {/* FAQ Content with Tabs */}
      <FaqContent />

      {/* CTA Section */}
      <FaqCTA />
    </div>
  );
}
