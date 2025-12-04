import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Phone, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MpesaPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticketType: string;
  amount: number;
}

type PaymentStatus = "idle" | "initiating" | "waiting" | "checking" | "completed" | "failed";

const MpesaPaymentDialog = ({
  open,
  onOpenChange,
  ticketType,
  amount,
}: MpesaPaymentDialogProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setPhoneNumber("");
      setStatus("idle");
      setCheckoutRequestId(null);
      setErrorMessage(null);
    }
  }, [open]);

  // Poll for payment status
  useEffect(() => {
    if (status !== "waiting" || !checkoutRequestId) return;

    const pollInterval = setInterval(async () => {
      try {
        setStatus("checking");
        const { data, error } = await supabase.functions.invoke("check-payment-status", {
          body: { checkoutRequestId },
        });

        if (error) throw error;

        if (data.status === "completed") {
          setStatus("completed");
          toast.success("Payment successful!", {
            description: `Receipt: ${data.receiptNumber}`,
          });
          clearInterval(pollInterval);
        } else if (data.status === "failed") {
          setStatus("failed");
          setErrorMessage("Payment was cancelled or failed");
          clearInterval(pollInterval);
        } else {
          setStatus("waiting");
        }
      } catch (err) {
        console.error("Status check error:", err);
        setStatus("waiting");
      }
    }, 3000);

    // Stop polling after 2 minutes
    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
      if (status === "waiting") {
        setStatus("failed");
        setErrorMessage("Payment timed out. Please try again.");
      }
    }, 120000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [status, checkoutRequestId]);

  const handleInitiatePayment = async () => {
    // Validate phone number
    const cleanPhone = phoneNumber.replace(/\s+/g, "");
    if (!cleanPhone || cleanPhone.length < 9) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setStatus("initiating");
    setErrorMessage(null);

    try {
      const { data, error } = await supabase.functions.invoke("mpesa-stk-push", {
        body: {
          phoneNumber: cleanPhone,
          amount,
          ticketType,
        },
      });

      if (error) throw error;

      if (data.success) {
        setCheckoutRequestId(data.checkoutRequestId);
        setStatus("waiting");
        toast.info("Check your phone", {
          description: "Enter your M-Pesa PIN to complete payment",
        });
      } else {
        throw new Error(data.error || "Failed to initiate payment");
      }
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      setStatus("failed");
      setErrorMessage(err.message || "Failed to initiate payment");
      toast.error("Payment failed", {
        description: err.message || "Please try again",
      });
    }
  };

  const handleClose = () => {
    if (status === "initiating" || status === "checking") return;
    onOpenChange(false);
  };

  const renderContent = () => {
    switch (status) {
      case "idle":
        return (
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Ticket</span>
                <span className="font-medium">{ticketType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Amount</span>
                <span className="text-xl font-bold text-primary">KES {amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">M-Pesa Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0712 345 678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter the phone number registered with M-Pesa
              </p>
            </div>

            <Button onClick={handleInitiatePayment} className="w-full" size="lg">
              Pay with M-Pesa
            </Button>
          </div>
        );

      case "initiating":
        return (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">Initiating payment...</p>
            <p className="text-sm text-muted-foreground">Please wait</p>
          </div>
        );

      case "waiting":
      case "checking":
        return (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="relative">
              <Phone className="h-16 w-16 text-primary" />
              <div className="absolute -top-1 -right-1">
                <span className="flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
                </span>
              </div>
            </div>
            <p className="text-lg font-medium">Check your phone</p>
            <p className="text-sm text-muted-foreground text-center">
              An M-Pesa prompt has been sent to your phone.
              <br />
              Enter your PIN to complete payment.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Waiting for confirmation...
            </div>
          </div>
        );

      case "completed":
        return (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <p className="text-lg font-medium text-green-600">Payment Successful!</p>
            <p className="text-sm text-muted-foreground text-center">
              Your ticket for {ticketType} has been confirmed.
              <br />
              You will receive a confirmation SMS shortly.
            </p>
            <Button onClick={handleClose} className="mt-4">
              Done
            </Button>
          </div>
        );

      case "failed":
        return (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <XCircle className="h-16 w-16 text-destructive" />
            <p className="text-lg font-medium text-destructive">Payment Failed</p>
            <p className="text-sm text-muted-foreground text-center">
              {errorMessage || "Something went wrong. Please try again."}
            </p>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={() => setStatus("idle")}>
                Try Again
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg"
              alt="M-Pesa"
              className="h-6"
            />
            M-Pesa Payment
          </DialogTitle>
          <DialogDescription>
            Secure payment via Safaricom M-Pesa
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default MpesaPaymentDialog;
