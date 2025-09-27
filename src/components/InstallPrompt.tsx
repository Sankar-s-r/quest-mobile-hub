import { useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePWA } from "@/hooks/usePWA";

export function InstallPrompt() {
  const { isInstallable, installApp } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || dismissed) return null;

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setDismissed(true);
    }
  };

  return (
    <Card className="fixed bottom-20 left-4 right-4 z-50 border-primary/20 bg-card/95 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Install AsanoGa</h3>
            <p className="text-xs text-muted-foreground">
              Get quick access and offline features
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleInstall} className="h-8 px-3">
              <Download className="h-3 w-3 mr-1" />
              Install
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setDismissed(true)}
              className="h-8 w-8 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}