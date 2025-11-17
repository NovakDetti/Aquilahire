"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, FileText } from "lucide-react";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "./hooks/use-toast";

export default function NewCVPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    language: "hu",
    textContent: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.textContent.trim()) {
      toast({
        title: "Hiányzó adatok",
        description: "Kérlek, töltsd ki az összes mezőt!",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_N8N_BASE_URL;
      if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_N8N_BASE_URL nincs beállítva");
      }

      const response = await fetch(`${baseUrl}/webhook/cv-process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          language: formData.language,
          textContent: formData.textContent,
        }),
      });

      if (!response.ok) {
        throw new Error("CV feldolgozása sikertelen");
      }

      const data = await response.json();

      toast({
        title: "Sikeres mentés! ✓",
        description: `CV azonosító: ${data.cvId}. ${
          data.summary || "CV feldolgozva."
        }`,
      });

      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Hiba történt",
        description:
          error instanceof Error ? error.message : "Próbáld újra később",
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
          <h1 className="text-3xl font-bold mb-2">
            Új önéletrajz hozzáadása
          </h1>
          <p className="text-muted-foreground">
            Illeszd be az önéletrajzod szövegét, és a rendszer elemzi a szakmai
            háttered
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              CV adatok
            </CardTitle>
            <CardDescription>
              Az AI feldolgozza a CV-det és személyre szabott interjúkérdéseket
              generál
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* CV Name */}
              <div className="space-y-2">
                <Label htmlFor="name">CV elnevezése *</Label>
                <Input
                  id="name"
                  placeholder="pl. Junior Developer CV"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  disabled={loading}
                />
              </div>

              {/* Language */}
              <div className="space-y-2">
                <Label htmlFor="language">Nyelv *</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, language: value }))
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

              {/* CV Content */}
              <div className="space-y-2">
                <Label htmlFor="content">CV tartalma *</Label>
                <Textarea
                  id="content"
                  placeholder={
                    "Illeszd be az önéletrajzod szövegét ide...\n\nNév: ...\nVégzettség: ...\nTapasztalat: ...\nKészségek: ..."
                  }
                  value={formData.textContent}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      textContent: e.target.value,
                    }))
                  }
                  disabled={loading}
                  className="min-h-[300px] font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground">
                  Illeszd be az önéletrajzod szöveges verzióját. Az AI elemezni
                  fogja a tapasztalatod, készségeid és végzettséged alapján.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  disabled={loading}
                  className="flex-1"
                >
                  Mégse
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 shadow-primary"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Feldolgozás...
                    </>
                  ) : (
                    "CV mentése és feldolgozása"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
