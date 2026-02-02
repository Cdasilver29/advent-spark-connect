import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
}

const FAQ = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (data && !error) {
      setFaqs(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
            <Skeleton className="h-12 w-72 mx-auto mb-4" />
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (faqs.length === 0) {
    return null;
  }

  // Group FAQs by category
  const groupedFaqs = faqs.reduce((acc, faq) => {
    const category = faq.category || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <ScrollAnimationWrapper animation="fadeUp" className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to know about Singles Spark
          </p>
        </ScrollAnimationWrapper>

        <div className="max-w-3xl mx-auto">
          {Object.entries(groupedFaqs).map(([category, categoryFaqs], categoryIndex) => (
            <ScrollAnimationWrapper
              key={category} 
              animation="fadeUp"
              delay={categoryIndex * 150}
              className="mb-8"
            >
              <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {category}
              </h3>
              <Accordion type="single" collapsible className="space-y-3">
                {categoryFaqs.map((faq, faqIndex) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="border border-border/50 rounded-lg px-4 bg-card shadow-soft hover:shadow-medium hover:border-primary/30 transition-all duration-300"
                    style={{ animationDelay: `${(categoryIndex * 0.15) + (faqIndex * 0.05)}s` }}
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-4 group">
                      <span className="font-medium text-foreground pr-4 group-hover:text-primary transition-colors duration-300">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollAnimationWrapper>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a
              href="mailto:contact@singlesspark.com"
              className="text-primary font-medium hover:underline"
            >
              Contact us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
