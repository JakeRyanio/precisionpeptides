import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Research Peptides FAQ | Common Questions About Lab-Tested Peptides",
  description: "Get answers to frequently asked questions about research peptides, purity testing, storage, reconstitution, and ordering. Expert guidance for peptide research applications.",
  keywords: "peptide FAQ, research peptides questions, peptide storage, peptide reconstitution, lab tested peptides, peptide purity, research peptide ordering"
}

export default function FAQPage() {
  const faqs = [
    {
      question: "What are research peptides?",
      answer:
        "Research peptides are short chains of amino acids used exclusively for scientific research and laboratory applications. They are not intended for human consumption and are designed to help researchers study various biological processes and mechanisms.",
    },
    {
      question: "How do you ensure peptide purity?",
      answer:
        "Every batch of our peptides undergoes rigorous testing using HPLC (High-Performance Liquid Chromatography) and mass spectrometry. We guarantee 99%+ purity and provide detailed certificates of analysis with each order.",
    },
    {
      question: "What is your shipping policy?",
      answer:
        "We offer fast, temperature-controlled shipping to maintain peptide integrity. Orders are typically processed within 24-48 hours and shipped via cold-chain delivery. Domestic orders usually arrive within 2-3 business days.",
    },
    {
      question: "Are your peptides legal?",
      answer:
        "Yes, our peptides are legal for research purposes. All products are clearly labeled 'For Research Use Only' and are not intended for human consumption. Customers are responsible for ensuring compliance with local regulations.",
    },
    {
      question: "How should peptides be stored?",
      answer:
        "Lyophilized (freeze-dried) peptides should be stored at -20°C or below in a dry environment. Once reconstituted, peptides should be stored at 2-8°C and used within the timeframe specified in the product documentation.",
    },
    {
      question: "Do you provide certificates of analysis?",
      answer:
        "Yes, we provide detailed certificates of analysis (COA) with every order. These documents include purity analysis, molecular weight confirmation, and other relevant analytical data to support your research.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept major credit cards, bank transfers, and cryptocurrency payments. All transactions are processed securely through encrypted payment gateways.",
    },
    {
      question: "Can I return or exchange products?",
      answer:
        "Due to the nature of research chemicals, we cannot accept returns of opened products. However, if you receive a damaged or incorrect item, please contact us within 48 hours for a replacement or refund.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship to most countries worldwide. International shipping times vary by location, and customers are responsible for any customs duties or import fees. Some restrictions may apply based on local regulations.",
    },
    {
      question: "How do I reconstitute lyophilized peptides?",
      answer:
        "Detailed reconstitution instructions are provided with each product. Generally, peptides should be reconstituted with sterile water or appropriate buffer solutions. Always follow the specific guidelines provided for each peptide.",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* FAQ Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Research Peptides FAQ</h1>
          <p className="text-xl text-gray-400">
            Expert answers to common questions about lab-tested research peptides and scientific applications
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-gray-900/50 border border-gray-800 rounded-lg px-6"
            >
              <AccordionTrigger className="text-left hover:text-cyan-400 transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 leading-relaxed">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 p-8 bg-gray-900/50 rounded-lg border border-gray-800 text-center">
          <h3 className="text-2xl font-semibold mb-4">Still have questions?</h3>
          <p className="text-gray-400 mb-6">
            Our scientific support team is here to help with any technical questions about our products.
          </p>
          <p className="text-gray-400">
            For support, email us at{" "}
            <a href="mailto:precisionpeptides@proton.me" className="text-cyan-400 hover:text-cyan-300">
              precisionpeptides@proton.me
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
