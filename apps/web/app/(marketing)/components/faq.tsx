"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    question: "Which AI models does Aria use?",
    answer: "Aria is built on OpenAI's GPT models, with GPT-4o mini available on the Free plan and access to the latest models on Pro and Team.",
  },
  {
    question: "Can I edit a message after sending it?",
    answer: "Yes. Editing a previous message removes everything after it and continues the conversation from your edit — similar to rewriting history.",
  },
  {
    question: "Is my conversation data private?",
    answer: "Your chats are tied to your account and are not visible to other users. You can delete any conversation permanently at any time.",
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Yes, you can cancel from the billing section of your settings at any time and you will keep access until the end of your billing period.",
  },
  {
    question: "Do you offer a free trial for the Pro plan?",
    answer: "Yes, every new account gets a 14-day trial of the Pro plan before any payment is required.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-t border-border py-24">
      <div className="container max-w-2xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Frequently asked questions</h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
