"use client";
import React, { useState } from "react";
import TestimonialSingle from "./testimonial-single";

const faqData = [
  {
    question: "What is SmartSprint?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        <p>
          SmartSprint is an AI-driven platform designed to optimize project 
          management. It automates task tracking, enhances collaboration, 
          and provides intelligent insights to help teams work more efficiently.
        </p>
      </div>
    ),
  },
  {
    question: "How does the free plan work?",
    answer:
      "Our free plan provides 1 AI-powered recommendations for project structuring and task automation. This allows you to explore SmartSprint’s features and experience its capabilities at no cost.",
  },
  {
    question: "What features are included in the subscription plan?",
    answer:
      "The subscription plan includes unlimited AI-powered project recommendations, advanced workflow automation, priority support, collaboration tools, and premium analytics for real-time progress tracking.",
  },
  {
    question: "Can I try SmartSprint before subscribing?",
    answer:
      "Absolutely! You can start with our free plan, which includes 50 AI-powered recommendations. This enables you to test SmartSprint’s automation features before committing to a subscription.",
  },
  {
    question: "How does AI assist in project management?",
    answer:
      "Our AI analyzes historical data, task dependencies, and project goals to automate workflows, predict completion timelines, and resolve minor issues autonomously. It ensures projects stay on track with minimal manual intervention.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, we prioritize data security. All user data is encrypted, and we adhere to strict privacy policies to ensure your information remains confidential and protected.",
  },
  {
    question: "Can I customize AI-generated recommendations?",
    answer:
      "Yes! While our AI provides structured recommendations, you have full control to edit, customize, and refine them to better fit your project requirements and workflow.",
  },
  {
    question: "What types of projects does SmartSprint support?",
    answer:
      "SmartSprint is versatile and supports various project types, from software development and marketing campaigns to product launches and operational management.",
  },
  {
    question: "How often is the platform updated?",
    answer:
      "We continuously improve SmartSprint with new features and AI enhancements. Subscribers receive early access to updates, ensuring they always benefit from the latest innovations in AI-driven project management.",
  },
  {
    question: "Can I collaborate with my team on SmartSprint?",
    answer:
      "Yes! SmartSprint includes collaboration features that allow team members to share, edit, and manage workflows together in real-time, ensuring seamless communication and teamwork.",
  },
];

const FAQItem = ({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <li>
      <button
        className="relative flex w-full items-center gap-2 border-t border-slate-200 py-5 text-left text-base font-semibold md:text-lg"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="flex-1 text-slate-800">{question}</span>
        <svg
          className={`ml-auto h-4 w-4 flex-shrink-0 fill-current transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 12L2 6h12l-6 6z" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pb-5 leading-relaxed text-slate-600">
          {typeof answer === "string" ? <p>{answer}</p> : answer}
        </div>
      </div>
    </li>
  );
};

export default function FAQ({ config }: { config?: any }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-slate-50" id="faq">
      <div className="mx-auto max-w-7xl px-8 py-24">
        <div className="flex flex-col gap-12 md:flex-row">
          <div className="flex basis-1/2 flex-col text-left">
            <p className="mb-4 inline-block font-bold text-blue-500">FAQ</p>
            <p className="text-3xl font-extrabold text-slate-800 md:text-4xl">
              Frequently Asked Questions
            </p>
          </div>
          <ul className="basis-1/2">
            {faqData.map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === index}
                onClick={() => handleToggle(index)}
              />
            ))}
          </ul>
        </div>
        <TestimonialSingle
          testimonial={{
            name: "Taouil Fatimaezzahrae",
            content:
              "SmartSprint has revolutionized my project management. Thanks to its AI, our workflow is automated, tasks are optimized, and we save valuable time on organization. My team is more productive and efficient than ever !",
            schoolName: "Westfield High School",
            image: "https://api.dicebear.com/6.x/avataaars/svg?seed=Emily",
          }}
        />
      </div>
    </section>  
  );
}
