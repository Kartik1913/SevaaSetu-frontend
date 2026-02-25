import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "How do I apply for an opportunity?",
    answer:
      "Browse opportunities, click 'Apply Now', and submit your application. NGOs will review and respond.",
  },
  {
    question: "Is SevaaSetu free to use?",
    answer:
      "Yes. Volunteers and NGOs can register and use the platform free of cost.",
  },
  {
    question: "How are NGOs verified?",
    answer:
      "Our team manually reviews NGO details before marking them as verified.",
  },
  {
    question: "Can I cancel my application?",
    answer:
      "Currently, you cannot cancel directly. You may contact the NGO for withdrawal.",
  },
  {
    question: "How do I edit my profile?",
    answer:
      "Go to your dashboard and click 'Edit Profile' to update your details.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow py-16">
        <div className="container mx-auto px-4 max-w-3xl">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground">
              Everything you need to know about SevaaSetu.
            </p>
          </div>

          {/* FAQ Cards */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="civic-card bg-card border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex justify-between items-center p-5 text-left"
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 pb-5 text-muted-foreground text-sm"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;