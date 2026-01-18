import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, Camera, RefreshCw, User, Church, Clock, Keyboard, Search } from "lucide-react";

interface ScanResult {
  success: boolean;
  message: string;
  registration?: {
    full_name: string;
    email: string;
    church_name: string;
    age_group: string;
    checked_in: boolean;
    checked_in_at: string | null;
  };
}

interface QRScannerProps {
  onCheckIn?: (registrationCode: string) => void;
  userId?: string;
}

const QRScanner = ({ onCheckIn, userId }: QRScannerProps) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const { toast } = useToast();
  const mountId = "qr-reader";

  const processQRCode = async (decodedText: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Try to parse as JSON (QR code contains ticket data)
      let registrationCode: string;
      try {
        const data = JSON.parse(decodedText);
        registrationCode = data.code || data.registration_code || decodedText;
      } catch {
        // If not JSON, use as plain registration code
        registrationCode = decodedText.toUpperCase().trim();
      }

      // Validate code format (6 characters alphanumeric)
      if (!/^[A-Z0-9]{6}$/.test(registrationCode)) {
        setLastResult({
          success: false,
          message: "Invalid QR code format. Expected 6-character registration code.",
        });
        setIsProcessing(false);
        return;
      }

      // Look up the registration
      const { data: registration, error } = await supabase
        .from("registrations")
        .select("id, full_name, email, church_name, age_group, checked_in, checked_in_at, registration_code")
        .eq("registration_code", registrationCode)
        .single();

      if (error || !registration) {
        setLastResult({
          success: false,
          message: `No registration found for code: ${registrationCode}`,
        });
        setIsProcessing(false);
        return;
      }

      // Check if already checked in
      if (registration.checked_in) {
        setLastResult({
          success: false,
          message: `Already checked in at ${new Date(registration.checked_in_at!).toLocaleTimeString()}`,
          registration: {
            full_name: registration.full_name,
            email: registration.email,
            church_name: registration.church_name,
            age_group: registration.age_group,
            checked_in: registration.checked_in,
            checked_in_at: registration.checked_in_at,
          },
        });
        setIsProcessing(false);
        return;
      }

      // Mark as checked in
      const { error: updateError } = await supabase
        .from("registrations")
        .update({
          checked_in: true,
          checked_in_at: new Date().toISOString(),
          checked_in_by: userId,
        })
        .eq("id", registration.id);

      if (updateError) {
        setLastResult({
          success: false,
          message: "Failed to check in. Please try again.",
        });
        setIsProcessing(false);
        return;
      }

      setLastResult({
        success: true,
        message: "Successfully checked in!",
        registration: {
          full_name: registration.full_name,
          email: registration.email,
          church_name: registration.church_name,
          age_group: registration.age_group,
          checked_in: true,
          checked_in_at: new Date().toISOString(),
        },
      });

      toast({
        title: "Check-in Successful!",
        description: `${registration.full_name} has been checked in.`,
      });

      onCheckIn?.(registrationCode);
    } catch (err) {
      setLastResult({
        success: false,
        message: "Error processing QR code. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const startScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {});
    }

    setIsScanning(true);
    setLastResult(null);

    const scanner = new Html5QrcodeScanner(
      mountId,
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
      },
      false
    );

    scanner.render(
      (decodedText: string) => {
        processQRCode(decodedText);
      },
      (err: any) => {
        // Ignore scanning errors (happens continuously while looking for QR)
      }
    );

    scannerRef.current = scanner;
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {});
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const resetScanner = () => {
    setLastResult(null);
    if (!isScanning) {
      startScanner();
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, []);

  const handleManualCheckIn = () => {
    const code = manualCode.toUpperCase().trim();
    if (code) {
      processQRCode(code);
      setManualCode("");
    }
  };

  const ResultDisplay = () => (
    <>
      {lastResult && (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg border-2 ${
              lastResult.success
                ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {lastResult.success ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
              <span
                className={`font-semibold ${
                  lastResult.success ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"
                }`}
              >
                {lastResult.message}
              </span>
            </div>

            {lastResult.registration && (
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{lastResult.registration.full_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Church className="w-4 h-4 text-muted-foreground" />
                  <span>{lastResult.registration.church_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{lastResult.registration.age_group}</Badge>
                </div>
                {lastResult.registration.checked_in_at && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      Checked in: {new Date(lastResult.registration.checked_in_at).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <Button onClick={resetScanner} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Check In Another
          </Button>
        </div>
      )}

      {isProcessing && (
        <div className="text-center py-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-muted-foreground">Processing...</p>
        </div>
      )}
    </>
  );

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Event Check-In</CardTitle>
        <CardDescription>
          Scan QR codes or enter registration codes manually
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="scanner" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              QR Scanner
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4 mt-4">
            {!lastResult && !isProcessing && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="manual-code">Registration Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="manual-code"
                      placeholder="Enter 6-character code (e.g., ABC123)"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                      maxLength={6}
                      className="font-mono text-lg tracking-widest uppercase"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleManualCheckIn();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleManualCheckIn} 
                      disabled={manualCode.length !== 6}
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Check In
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter the 6-character registration code from the participant's ticket
                  </p>
                </div>
              </div>
            )}
            <ResultDisplay />
          </TabsContent>

          <TabsContent value="scanner" className="space-y-4 mt-4">
            {!isScanning && !lastResult && !isProcessing && (
              <div className="text-center py-8">
                <Camera className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Click the button below to start scanning QR codes
                </p>
                <Button onClick={startScanner} size="lg">
                  <Camera className="w-4 h-4 mr-2" />
                  Start Scanner
                </Button>
              </div>
            )}

            {isScanning && (
              <div className="space-y-4">
                <div
                  id={mountId}
                  className="w-full rounded-lg overflow-hidden border"
                />
                <Button variant="outline" onClick={stopScanner} className="w-full">
                  Stop Scanner
                </Button>
              </div>
            )}

            <ResultDisplay />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default QRScanner;
