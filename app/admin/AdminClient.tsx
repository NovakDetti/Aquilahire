"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { User, Trash2 } from "lucide-react";
import { useToast } from "../hooks/use-toast";

type Plan = "Starter" | "Pro" | "Premium";

type Props = {
  user: {
    name: string;
    email: string;
    memberSince: string;
  };
  settings: {
    plan: Plan;
    emailNotif: boolean;
    newsletter: boolean;
  };
};

export default function AdminClient({ user, settings }: Props) {
  const { toast } = useToast();

  const [plan, setPlan] = useState<Plan>(settings.plan);
  const [emailNotif, setEmailNotif] = useState(settings.emailNotif);
  const [newsletter, setNewsletter] = useState(settings.newsletter);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function updateSettings(
    partial: Partial<{
      plan: Plan;
      emailNotif: boolean;
      newsletter: boolean;
    }>
  ) {
    const newValues = {
      plan,
      emailNotif,
      newsletter,
      ...partial,
    };

    setPlan(newValues.plan);
    setEmailNotif(newValues.emailNotif);
    setNewsletter(newValues.newsletter);
    setIsSavingSettings(true);

    try {
      const res = await fetch("/api/dashboard/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newValues),
      });

      if (!res.ok) {
        throw new Error("A beállítások mentése sikertelen.");
      }

      toast({
        title: "Beállítások mentve",
        description: "A fiók beállításai frissültek.",
      });
    } catch (err) {
      toast({
        title: "Hiba történt",
        description:
          err instanceof Error
            ? err.message
            : "Nem sikerült menteni a beállításokat.",
        variant: "destructive",
      });
    } finally {
      setIsSavingSettings(false);
    }
  }

  const handleDeleteData = async () => {
    const yes = window.confirm(
      "Biztosan törölni szeretnéd az ÖSSZES adatod (CV-k, interjúk, riportok)? Ez a művelet nem vonható vissza."
    );

    if (!yes) return;

    try {
      setIsDeleting(true);

      const res = await fetch("/api/account/delete", {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("A törlés sikertelen volt.");
      }

      toast({
        title: "Adatok törölve",
        description:
          "Az összes fiókhoz kapcsolódó adatod törlésre került. Jelentkezz ki, vagy kezdj újra egy új fiókkal.",
      });
    } catch (error) {
      toast({
        title: "Hiba történt",
        description:
          error instanceof Error
            ? error.message
            : "Nem sikerült törölni az adatokat. Próbáld újra később.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Beállítások</h1>
        <p className="text-muted-foreground">
          Fiókod, előfizetésed és adatkezelés kezelése.
        </p>
      </div>

      {/* Fiók & előfizetés */}
      <Card>
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Fiók & előfizetés beállításai</CardTitle>
            <CardDescription>
              Csomagváltás, értesítések és alapértelmezett interjú nyelv.
            </CardDescription>
          </div>
          {isSavingSettings && (
            <p className="text-xs text-muted-foreground">
              Mentés folyamatban...
            </p>
          )}
        </CardHeader>
        <CardContent className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Aktuális csomag</p>
              <Select
                value={plan}
                onValueChange={(value) =>
                  updateSettings({ plan: value as Plan })
                }
              >
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Válassz csomagot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Starter">Starter – kezdéshez</SelectItem>
                  <SelectItem value="Pro">
                    Pro – rendszeres gyakorláshoz
                  </SelectItem>
                  <SelectItem value="Premium">
                    Premium – intenzív felkészülés
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-2 text-xs text-muted-foreground">
                A csomagváltás jelenleg csak demo – később ide jöhet Stripe /
                Billing.
              </p>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">
                Alapértelmezett interjú nyelv
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="font-normal">
                  🇭🇺 Magyar
                </Button>
                <Button variant="outline" size="sm" className="font-normal">
                  🇬🇧 Angol
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium">Értesítések</p>

            <div className="flex items-center justify-between rounded-lg border bg-card/60 px-3 py-2">
              <div>
                <p className="text-sm font-medium">
                  Email értesítés interjúkról
                </p>
                <p className="text-xs text-muted-foreground">
                  Időpontfoglalás, változás, kész riport – mindről kapsz emailt.
                </p>
              </div>
              <Switch
                checked={emailNotif}
                onCheckedChange={(checked) =>
                  updateSettings({ emailNotif: Boolean(checked) })
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border bg-card/60 px-3 py-2">
              <div>
                <p className="text-sm font-medium">Hírlevél & tippek</p>
                <p className="text-xs text-muted-foreground">
                  Időnként kapsz interjú-tippeket és újdonságokat az
                  alkalmazásról.
                </p>
              </div>
              <Switch
                checked={newsletter}
                onCheckedChange={(checked) =>
                  updateSettings({ newsletter: Boolean(checked) })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Felhasználói adatok + Danger zone */}
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle>Felhasználói adatok & adatkezelés</CardTitle>
          <CardDescription>
            Itt látod az alap profiladataidat, és itt tudod kérni az összes
            tárolt adatod törlését is.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8 md:grid-cols-[1.6fr,1.4fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-purple-500/30">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs uppercase text-muted-foreground">
                  Fiók létrehozva
                </p>
                <p className="text-sm font-medium">{user.memberSince}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase text-muted-foreground">
                  Aktuális csomag
                </p>
                <p className="text-sm font-medium">{plan}</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Később ide jöhet egy profil szerkesztő (név, avatar, számlázási
              adatok, stb.). Jelenleg csak megjelenítés.
            </p>
          </div>

          <div className="space-y-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4">
            <p className="text-sm font-semibold text-destructive flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Adatok törlése
            </p>
            <p className="text-xs text-muted-foreground">
              Az adatok törlése a fiókodhoz kapcsolódó összes tartalmat
              eltávolítja: önéletrajzok, interjúk, riportok, beállítások. A
              művelet nem vonható vissza.
            </p>
            <Button
              variant="destructive"
              className="mt-2"
              onClick={handleDeleteData}
              disabled={isDeleting}
            >
              {isDeleting
                ? "Adatok törlése folyamatban..."
                : "Összes adatom törlése"}
            </Button>
            <p className="text-[11px] text-muted-foreground">
              Ha csak egy-egy CV-t vagy interjút szeretnél törölni, azt a
              Dashboard / Interjúk / CV-k listáiban tudod megtenni. Ez a gomb a
              teljes fiókadatbázist érinti.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
