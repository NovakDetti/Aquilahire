import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MessageSquare } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useToast } from "./hooks/use-toast";

const NewInterview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const cvList = [
    { id: "1", name: "Junior Developer CV" },
    { id: "2", name: "Senior Developer CV" },
  ];

  const [formData, setFormData] = useState({
    cvId: searchParams.get("cvId") || "",
    positionTitle: "",
    language: "hu",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cvId || !formData.positionTitle.trim()) {
      toast({
        title: "Hiányzó adatok",
        description: "Kérlek, töltsd ki az összes mezőt!",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_N8N_BASE_URL}/webhook/interview-start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cvId: formData.cvId,
            positionTitle: formData.positionTitle,
            language: formData.language,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Interjú indítása sikertelen");
      }

      const data = await response.json();

      toast({
        title: "Interjú elindítva! 🎯",
        description: `${data.questions?.length || 8} kérdés lett generálva a pozícióra.`,
      });

      navigate(`/interview/${data.interviewId}`);
    } catch (error) {
      toast({
        title: "Hiba történt",
        description: error instanceof Error ? error.message : "Próbáld újra később",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Új interjú indítása</h1>
          <p className="text-muted-foreground">
            Válaszd ki a CV-det, add meg a pozíciót, és kezdheted a gyakorlást
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Interjú beállítások
            </CardTitle>
            <CardDescription>
              Az AI a CV-d és a pozíció alapján személyre szabott kérdéseket generál
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* CV Selection */}
              <div className="space-y-2">
                <Label htmlFor="cv">Válaszd ki a CV-t *</Label>
                <Select
                  value={formData.cvId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, cvId: value })
                  }
                  disabled={loading}
                >
                  <SelectTrigger id="cv">
                    <SelectValue placeholder="Válassz egy CV-t..." />
                  </SelectTrigger>
                  <SelectContent>
                    {cvList.map((cv) => (
                      <SelectItem key={cv.id} value={cv.id}>
                        {cv.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Ha még nem töltöttél fel CV-t,{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => navigate("/cv/new")}
                    type="button"
                  >
                    hozz létre egyet
                  </Button>
                </p>
              </div>

              {/* Position Title */}
              <div className="space-y-2">
                <Label htmlFor="position">Pozíció megnevezése *</Label>
                <Input
                  id="position"
                  placeholder="pl. Junior Frontend Developer"
                  value={formData.positionTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, positionTitle: e.target.value })
                  }
                  disabled={loading}
                />
                <p className="text-sm text-muted-foreground">
                  Add meg azt a pozíciót, amire készülsz
                </p>
              </div>

              {/* Language */}
              <div className="space-y-2">
                <Label htmlFor="language">Interjú nyelve *</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) =>
                    setFormData({ ...formData, language: value })
                  }
                  disabled={loading}
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hu">Magyar</SelectItem>
                    <SelectItem value="en">Angol</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-primary-light rounded-lg">
                <h4 className="font-semibold mb-2 text-primary">
                  Mit várhat tőled az interjú?
                </h4>
                <ul className="space-y-1 text-sm text-foreground">
                  <li>• 6-10 személyre szabott kérdés</li>
                  <li>• Valós idejű visszajelzés minden válaszra</li>
                  <li>• Részletes riport az interjú végén</li>
                  <li>• ~20-30 perc időtartam</li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  disabled={loading}
                  className="flex-1"
                >
                  Mégse
                </Button>
                <Button type="submit" disabled={loading} className="flex-1 shadow-primary">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Indítás...
                    </>
                  ) : (
                    "Interjú indítása"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewInterview;
