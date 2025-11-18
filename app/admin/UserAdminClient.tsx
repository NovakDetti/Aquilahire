"use client";

import { useState } from "react";
import {
  FileText,
  MessageSquare,
  Star,
  ArrowRight,
  Settings2,
  CheckCircle2,
  Clock,
  User,
  Trash2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "../hooks/use-toast";
import { UserAdminData } from "../types/dashboard";

type Props = UserAdminData;

export default function UserAdminClient({
  user,
  settings,
  stats,
  cvs,
  interviews,
}: Props) {
  const { toast } = useToast();

  const [plan, setPlan] = useState<"Starter" | "Pro" | "Premium">(settings.plan);
  const [emailNotif, setEmailNotif] = useState(settings.emailNotif);
  const [newsletter, setNewsletter] = useState(settings.newsletter);
  const [isDeleting, setIsDeleting] = useState(false);

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
          "Az összes fiókhoz kapcsolódó adatod törlésre került. Ha újra használni szeretnéd az oldalt, kérlek hozz létre új adatokat.",
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
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Saját admin felület
          </h1>
          <p className="text-muted-foreground">
            Kezeld az önéletrajzaid, interjúid és előfizetésed egy átlátható felületen.
          </p>
        </div>
        <Button className="shadow-primary">
          <MessageSquare className="mr-2 h-4 w-4" />
          Új interjú indítása
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Hátralévő interjúk (hó)
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.remainingThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              Az aktuális csomagod alapján ennyi interjút futtathatsz még ebben a
              hónapban.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Eddigi interjúk</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInterviews}</div>
            <p className="text-xs text-muted-foreground">
              Összesen lefuttatott AI állásinterjúk száma.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Átlagpontszám</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgScore}/100</div>
            <p className="text-xs text-muted-foreground">
              Az utolsó 10 interjú átlaga – irány a 90+! 💪
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.6fr,1.4fr]">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>CV-k kezelése</CardTitle>
              <CardDescription>
                Itt tudod karbantartani az önéletrajzaid, amiket az AI interjúk
                használni fognak.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Új CV hozzáadása
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-block h-2 w-2 rounded-full bg-violet-500" />
                <span>
                  Ajánlott: tarts meg max. 3-4 aktív CV-t, pozíciónként egyet.
                </span>
              </div>
              <Input
                placeholder="Keresés CV névre..."
                className="h-8 max-w-xs text-xs"
              />
            </div>

            <div className="space-y-3">
              {cvs.map((cv) => (
                <div
                  key={cv.id}
                  className="flex items-center justify-between gap-3 rounded-xl border bg-card/60 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{cv.name}</p>
                        <Badge
                          variant="secondary"
                          className="text-[10px] uppercase"
                        >
                          {cv.language === "hu" ? "HU" : "EN"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Létrehozva: {cv.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      Használat interjúhoz
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {cvs.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Még nincs elmentett önéletrajzod. Kezdd azzal, hogy{" "}
                  <span className="font-medium">hozzáadsz egy CV-t</span>.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Legutóbbi interjúid</CardTitle>
            <CardDescription>
              Nézd meg az állapotukat, pontszámot és részletes riportot.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {interviews.map((int) => (
              <div
                key={int.id}
                className="flex items-start justify-between gap-3 rounded-xl border bg-card/60 px-4 py-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{int.role}</p>
                    {int.status === "finished" && (
                      <Badge
                        className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px]"
                        variant="secondary"
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Befejezve
                      </Badge>
                    )}
                    {int.status === "scheduled" && (
                      <Badge
                        className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px]"
                        variant="secondary"
                      >
                        Ütemezve
                      </Badge>
                    )}
                    {int.status === "draft" && (
                      <Badge
                        className="bg-slate-50 text-slate-700 border border-slate-100 text-[10px]"
                        variant="secondary"
                      >
                        Vázlat
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    CV: {int.cvName} • {int.date}
                  </p>
                  {int.status === "finished" && int.score && (
                    <p className="mt-1 text-xs">
                      Pontszám:{" "}
                      <span className="font-semibold">{int.score}/100</span>
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  {int.status === "finished" ? (
                    <Button size="sm" variant="outline">
                      Részletes riport
                    </Button>
                  ) : int.status === "scheduled" ? (
                    <Button size="sm" variant="outline">
                      Időpont módosítása
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline">
                      Vázlat folytatása
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {interviews.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Még nem futtattál interjút. Kattints fent az{" "}
                <span className="font-medium">“Új interjú indítása”</span> gombra.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Fiók & előfizetés beállításai</CardTitle>
            <CardDescription>
              Csomagváltás, értesítések és alapértelmezett interjú nyelv.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Aktuális csomag</p>
              <Select
                value={plan}
                onValueChange={(value) => setPlan(value as typeof plan)}
              >
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Válassz csomagot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Starter">Starter – kezdéshez</SelectItem>
                  <SelectItem value="Pro">Pro – rendszeres gyakorláshoz</SelectItem>
                  <SelectItem value="Premium">
                    Premium – intenzív felkészülés
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-2 text-xs text-muted-foreground">
                A csomagváltás egyelőre csak demo – később itt tudjuk majd bekötni a
                fizetést / Stripe-ot vagy bármit, amit szeretnél.
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
                <p className="text-sm font-medium">Email értesítés interjúkról</p>
                <p className="text-xs text-muted-foreground">
                  Időpontfoglalás, változás, kész riport – mindről kapsz emailt.
                </p>
              </div>
              <Switch
                checked={emailNotif}
                onCheckedChange={setEmailNotif}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border bg-card/60 px-3 py-2">
              <div>
                <p className="text-sm font-medium">Hírlevél & tippek</p>
                <p className="text-xs text-muted-foreground">
                  Időnként kapsz interjú-tippeket és újdonságokat az alkalmazásról.
                </p>
              </div>
              <Switch
                checked={newsletter}
                onCheckedChange={setNewsletter}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle>Felhasználói adatok & adatkezelés</CardTitle>
          <CardDescription>
            Itt látod az alap profiladataidat, és itt tudod kérni az összes tárolt adatod
            törlését is.
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

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                A későbbiekben ide jöhet egy profil szerkesztő forma (név, avatar,
                számlázási adatok stb.). Egyelőre ez csak megjelenítés.
              </p>
              <Button variant="outline" size="sm">
                Profil adatok frissítése (hamarosan)
              </Button>
            </div>
          </div>
          <div className="space-y-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4">
            <p className="text-sm font-semibold text-destructive flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Adatok törlése
            </p>
            <p className="text-xs text-muted-foreground">
              Az adatok törlése a fiókodhoz kapcsolódó összes tartalmat eltávolítja:
              önéletrajzok, interjúk, riportok, beállítások. A művelet nem vonható vissza.
            </p>
            <Button
              variant="destructive"
              className="mt-2"
              onClick={handleDeleteData}
              disabled={isDeleting}
            >
              {isDeleting ? "Adatok törlése folyamatban..." : "Összes adatom törlése"}
            </Button>
            <p className="text-[11px] text-muted-foreground">
              Ha csak egy-egy CV-t vagy interjút szeretnél törölni, azt a fenti listákban
              tudod megtenni. Ez a gomb a teljes fiókadatbázist érinti.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
