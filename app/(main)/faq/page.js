import FaqContent from "./_components/FaqContent";
import FaqCTA from "./_components/FaqCta";
import FaqHeader from "./_components/FaqHeader";

export default function FAQPage() {
  return (
    <div className="w-xl md:w-3xl lg:w-5xl xl:7xl max-w-full">
      {/* Header */}
      <FaqHeader />

      {/* FAQ Content with Tabs */}
      <FaqContent />

      {/* CTA Section */}
      <FaqCTA />
    </div>
  );
}
