import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import MpesaPaymentDialog from "./MpesaPaymentDialog";

interface SelectedTicket {
  name: string;
  price: number;
}

const Tickets = () => {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SelectedTicket | null>(null);

  const handlePurchase = (ticketName: string, price: number) => {
    setSelectedTicket({ name: ticketName, price });
    setPaymentDialogOpen(true);
  };

  // Extract numeric price from string
  const parsePrice = (priceStr: string): number => {
    return parseInt(priceStr.replace(/[^0-9]/g, ""), 10);
  };

  const ticketTiers = [
    {
      name: "Ages 21-28 (Early Bird)",
      price: "KES 1,500",
      originalPrice: "KES 2,000",
      description: "Limited time offer",
      features: [
        "Full event access",
        "All activities included",
        "Welcome refreshments",
        "Name tag & materials",
        "Match coordination service",
      ],
      popular: false,
    },
    {
      name: "Ages 21-28 (Standard)",
      price: "KES 2,000",
      description: "Young adults",
      features: [
        "Full event access",
        "All activities included",
        "Welcome refreshments",
        "Name tag & materials",
        "Match coordination service",
        "Event photos",
      ],
      popular: true,
    },
    {
      name: "Ages 28-40+ (Early Bird)",
      price: "KES 2,000",
      originalPrice: "KES 2,500",
      description: "Limited time offer",
      features: [
        "Full event access",
        "All activities included",
        "Welcome refreshments",
        "Name tag & materials",
        "Match coordination service",
        "Event photos",
      ],
      popular: false,
    },
    {
      name: "Ages 28-40+ (Standard)",
      price: "KES 2,500",
      description: "Adults",
      features: [
        "Full event access",
        "All activities included",
        "Welcome refreshments",
        "Name tag & materials",
        "Match coordination service",
        "Event photos",
        "Priority match coordination",
      ],
      popular: false,
    },
    {
      name: "VIP Experience",
      price: "KES 5,000",
      description: "Premium package (All ages)",
      features: [
        "Full event access",
        "All activities included",
        "Premium seating area",
        "VIP welcome package",
        "Professional photo session",
        "Priority match coordination",
        "Exclusive networking hour",
        "Complimentary drinks",
      ],
      popular: false,
    },
  ];

  return (
    <section id="tickets" className="py-20 bg-background">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get Your Tickets
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Choose your ticket tier and secure your spot for this life-changing event
          </p>
          <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary-foreground px-6 py-3 rounded-full">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Wedding sponsorship for matched couples!</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {ticketTiers.map((tier, index) => (
            <Card 
              key={index}
              className={`relative border-2 transition-all hover:shadow-strong ${
                tier.popular 
                  ? 'border-secondary scale-105 shadow-medium' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-gold text-foreground px-6 py-1.5 rounded-full text-sm font-bold shadow-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
                <div className="mb-2">
                  {tier.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through mr-2">
                      {tier.originalPrice}
                    </span>
                  )}
                  <div className="text-4xl font-bold text-primary">{tier.price}</div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => handlePurchase(tier.name, parsePrice(tier.price))}
                  className={`w-full ${
                    tier.popular 
                      ? 'bg-gradient-gold hover:opacity-90 text-foreground' 
                      : 'bg-primary hover:bg-primary-dark'
                  } font-semibold py-6`}
                >
                  Purchase Ticket
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Payment via M-PESA • Instant confirmation
          </p>
          <p className="text-sm text-muted-foreground">
            Secure payment powered by Safaricom Daraja API
          </p>
        </div>
      </div>

      {selectedTicket && (
        <MpesaPaymentDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          ticketType={selectedTicket.name}
          amount={selectedTicket.price}
        />
      )}
    </section>
  );
};

export default Tickets;
