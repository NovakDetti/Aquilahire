import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Globe, MessageSquare, Sparkles, Target, TrendingUp, Trophy, Users, Zap } from "lucide-react";
import Link from 'next/link'
import Image from "next/image";

import heroInterview from "@/assets/hero-interview.png";
import cvUpload from "@/assets/infographic-cv-upload.png";
import positionSelect from "@/assets/infographic-position.png";
import aiQuestions from "@/assets/infographic-ai-questions.png";
import reportAnalytics from "@/assets/infographic-report.png";

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-primary">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-gradient-primary">AquilaHire</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="lg" asChild>
              <Link href="/dashboard">Bejelentkezés</Link>
            </Button>
            <Button asChild size="lg" className="shadow-primary pulse-glow">
              <Link href="/dashboard">
                Kezdés ingyen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl floating" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-cyan/10 rounded-full blur-3xl floating" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-mint/10 rounded-full blur-3xl floating" style={{ animationDelay: "2s" }} />
      </div>

      <section className="pt-32 pb-24 px-4 bg-gradient-hero relative">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge variant="secondary" className="mb-4 px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                AI-alapú felkészítés
              </Badge>
              <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-tight">
                Ne az első éles interjún{" "}
                <span className="text-gradient-primary">
                  gyakorolj
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                AI alapú állásinterjú-szimulátor magyar nyelven. Töltsd fel az önéletrajzod, 
                és készülj fel egy valósághű interjúra, azonnali visszajelzéssel.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" asChild className="shadow-primary text-lg h-14 px-8">
                  <Link href="/dashboard">
                    Próbáld ki ingyen
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg h-14 px-8"
                  asChild
                >
                  <Link href="#how-it-works">
                    Nézd meg, hogyan működik
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Ingyenes próba</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Magyar nyelv</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">AI feedback</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
              <Image
                src={heroInterview} 
                alt="AI Interview Simulation" 
                className="relative z-10 w-full rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-5xl font-bold text-gradient-primary pb-8">Hogyan működik?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Négy egyszerű lépésben az első AI interjúdig
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              image: cvUpload,
              title: "CV feltöltése",
              description: "Illeszd be az önéletrajzod szövegét, és a rendszer elemzi a szakmai háttered",
              step: 1,
              gradient: "from-primary to-blue",
            },
            {
              image: positionSelect,
              title: "Pozíció kiválasztása",
              description: "Add meg, milyen pozícióra készülsz, és válaszd ki az interjú nyelvét",
              step: 2,
              gradient: "from-blue to-cyan",
            },
            {
              image: aiQuestions,
              title: "AI által vezetett interjú",
              description: "Válaszolj a személyre szabott kérdésekre, mintha egy valós interjún lennél",
              step: 3,
              gradient: "from-cyan to-mint",
            },
            {
              image: reportAnalytics,
              title: "Részletes riport",
              description: "Kapsz pontszámot, visszajelzést és konkrét fejlesztési javaslatokat",
              step: 4,
              gradient: "from-mint to-primary",
            },
          ].map((item) => (
            <Card
              key={item.step}
              className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border border-neutral-200 hover:border-primary/40 hover:shadow-lg group"
            >
              <CardHeader className="text-center pt-8">
                <div className="relative mx-auto mb-6">
                  <div
                    className={`
                      absolute inset-0
                      bg-gradient-to-br ${item.gradient}
                      opacity-45
                      blur-2xl rounded-full
                      group-hover:opacity-25
                      transition-opacity
                    `}
                  />
                  <div className="relative h-32 w-32 mx-auto bg-gradient-card rounded-2xl p-4 shadow-md">
                    <Image
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div
                    className={`
                      absolute -bottom-3 -right-3
                      h-12 w-12 rounded-full
                      bg-gradient-to-br ${item.gradient}
                      flex items-center justify-center
                      text-white font-bold text-xl shadow-lg
                    `}
                  >
                    {item.step}
                  </div>
                </div>
                <CardTitle className="text-xl mb-3">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-8">
                  <CardDescription className="text-base leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>  
</div>
      </section>

      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-5xl font-bold text-gradient-primary">Miért válaszd a AquilaHire-t?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professziónális felkészülés az állásinterjúra AI technológiával
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[
              {
                icon: Target,
                title: "Személyre szabott kérdések",
                description: "Az AI a CV-d és a választott pozíció alapján generál releváns, valósághű interjúkérdéseket",
                color: "primary",
              },
              {
                icon: Zap,
                title: "Azonnali visszajelzés",
                description: "Minden válasz után részletes elemzést, pontszámot és konkrét fejlesztési javaslatokat kapsz",
                color: "blue",
              },
              {
                icon: Globe,
                title: "Magyar és angol nyelv",
                description: "Gyakorolj anyanyelveden vagy fejleszd a nyelvtudásod angol nyelvű interjúkkal",
                color: "cyan",
              },
              {
                icon: Trophy,
                title: "Valós interjúhelyzet",
                description: "Szimulál egy igazi interjúhelyzetet, hogy magabiztosan léphess be az éles helyzetbe",
                color: "mint",
              },
            ].map((benefit, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-card">
                <CardHeader>
                  <div className="flex items-start gap-6">
                    <div className={`h-16 w-16 rounded-2xl bg-${benefit.color}/10 flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <benefit.icon className={`h-8 w-8 text-${benefit.color}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-3">{benefit.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {benefit.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

            <section className="py-24 px-4 bg-muted/10">
        <div className="container mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="relative">
              <div className="absolute -left-24 -top-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -right-10 bottom-0 w-64 h-64 bg-cyan/10 rounded-full blur-3xl" />
              <div className="relative mx-auto max-w-xs">
                <div className="rounded-[2.2rem] border border-border bg-gradient-to-br from-slate-50 to-slate-100 shadow-2xl px-3 pb-4 pt-5">
                  <div className="flex justify-center mb-4">
                    <div className="h-6 w-32 rounded-full bg-black/90" />
                  </div>
                  <div className="rounded-3xl bg-white border border-muted shadow-inner flex flex-col justify-between h-[420px] overflow-hidden">
                    <div className="p-6 flex-1 flex flex-col items-center justify-center gap-4 text-center">
                      <span className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
                        AquilaHire AI
                      </span>
                      <p className="text-lg font-medium text-foreground leading-relaxed">
                        „Mesélj a jelenlegi pozíciódról és a
                        legfontosabb felelősségeidről.”
                      </p>
                    </div>
                    <div className="px-5 py-4 border-t border-muted flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full border border-muted flex items-center justify-center">
                          ▌▌
                        </div>
                        <span>01:10</span>
                      </div>
                      <div className="h-8 px-4 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold shadow-primary">
                        Következő kérdés
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="space-y-3">
                <p className="text-sm font-semibold tracking-wide text-primary uppercase">
                  AI interjúgyakorlás
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-gradient-primary">
                  Mi van az AI interjú-szimulátorban?
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                  Kényelmesen gyakorolhatod a tipikus és iparág-specifikus
                  interjúkérdéseket. Az AquilaHire AI meghallgat,
                  elemez, és azonnali, személyre szabott visszajelzést ad.
                </p>
              </div>

              <div className="grid gap-10 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Fő funkciók</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {[
                      "Pozíció- és iparág-specifikus HR-stílusú interjúkérdések",
                      "Valós idejű visszajelzés a válaszaid tartalmára és felépítésére",
                      "Magabiztosság- és kommunikációs szint elemzése",
                      "Személyre szabott fejlesztési javaslatok minden kérdés után",
                      "Interjú riportok és fejlődéskövetés egy helyen",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Előnyök neked</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {[
                      "Stresszmentes gyakorlás – tét nélkül, bármikor, bárhonnan",
                      "Azonnali, őszinte feedback, amit egy élő interjún nem kapsz meg",
                      "Fejlesztheted a magyar és (később) az angol interjúkészségeidet is",
                      "Rugalmas – a saját időbeosztásodhoz igazodik",
                      "Valós példákon alapuló felkészülés az éles interjúkra",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  size="lg"
                  className="shadow-primary text-lg h-12 px-8"
                  asChild
                >
                  <Link href="/dashboard">
                    Próbáld ki az AI interjút
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-5xl font-bold text-gradient-primary">Válaszd a neked megfelelő csomagot</h2>
            <p className="text-xl text-muted-foreground">
              Kezdd ingyen, és frissíts, amikor szükséged van rá
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "3 900",
                features: [
                  "3 interjú / hó",
                  "Alapvető riportok",
                  "Magyar nyelv",
                  "Email támogatás",
                ],
                popular: false,
                gradient: "from-primary/10 to-blue/10",
              },
              {
                name: "Pro",
                price: "6 900",
                features: [
                  "10 interjú / hó",
                  "Részletes riportok",
                  "Magyar + Angol",
                  "Prioritás támogatás",
                  "Fejlett analitika",
                ],
                popular: true,
                gradient: "from-blue/10 to-cyan/10",
              },
              {
                name: "Premium",
                price: "9 900",
                features: [
                  "Korlátlan interjú",
                  "Teljes riportok",
                  "Minden nyelv",
                  "VIP támogatás",
                  "Egyéni coaching tippek",
                  "API hozzáférés",
                ],
                popular: false,
                gradient: "from-cyan/10 to-mint/10",
              },
            ].map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative overflow-hidden hover:shadow-2xl transition-all duration-300 ${
                  plan.popular ? "border-2 border-primary shadow-primary scale-105" : "border-2 hover:border-primary/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0">
                    <div className="bg-gradient-primary text-white text-center py-2 text-sm font-semibold">
                      ⭐ Legnépszerűbb
                    </div>
                  </div>
                )}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-50`} />
                <CardHeader className={`text-center ${plan.popular ? "pt-16" : "pt-8"} pb-8 relative`}>
                  <CardTitle className="text-3xl mb-2">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-gradient-primary">{plan.price}</span>
                    <span className="text-muted-foreground text-lg">Ft / hó</span>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full text-lg h-12" 
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/dashboard">
                      {plan.popular ? "Kezdés most" : "Választás"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-5xl font-bold text-gradient-primary">Gyakori kérdések</h2>
            <p className="text-xl text-muted-foreground">
              Minden, amit tudnod kell a AquilaHire-ról
            </p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: "Hogyan működik az AI interjúztató?",
                a: "Az AI elemzi a CV-det és a pozíciót, majd személyre szabott kérdéseket generál. Minden válaszod után azonnali visszajelzést kapsz pontszámmal és fejlesztési javaslatokkal.",
              },
              {
                q: "Milyen pozíciókra készülhetek?",
                a: "Bármilyen pozícióra! A rendszer rugalmasan alkalmazkodik a megadott munkakör követelményeihez, legyen az IT, HR, marketing vagy bármilyen más terület.",
              },
              {
                q: "Biztonságban vannak az adataim?",
                a: "Igen! Minden adat titkosítva van tárolva, és csak te férhetsz hozzá. A CV-ket biztonságosan kezeljük, és soha nem osztjuk meg harmadik féllel.",
              },
              {
                q: "Kipróbálhatom ingyen?",
                a: "Természetesen! A Starter csomag 3 ingyenes interjút tartalmaz havonta, hogy kipróbálhasd a rendszert kockázat nélkül.",
              },
              {
                q: "Mi van, ha nem vagyok elégedett?",
                a: "14 napos pénzvisszafizetési garanciát biztosítunk minden előfizetésre. Ha bármilyen okból nem vagy elégedett, visszatérítjük a díjat.",
              },
            ].map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-95" />
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-5xl font-bold mb-6 text-white">
            Készen állsz a következő interjúra?
          </h2>
          <p className="text-xl mb-10 text-white/90 leading-relaxed">
            Kezdd el a gyakorlást még ma, és légy magabiztosabb a következő állásinterjún!<br />
            Több ezer jelölt már használja sikeresen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="text-lg h-14 px-8 shadow-2xl">
              <Link href="/dashboard">
                Próbáld ki ingyen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg h-14 px-8 bg-white/10 hover:bg-white/20 text-white border-white/30">
              Nézd meg a demót
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-16 px-4 border-t bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-2xl text-gradient-primary">AquilaHire</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                AI-alapú állásinterjú szimulátor, amely segít felkészülni a következő nagy lehetőségre.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Termék</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link href="/" className="hover:text-primary transition-colors">Funkciók</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Árazás</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Cég</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link href="/" className="hover:text-primary transition-colors">Rólunk</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Karrier</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Kapcsolat</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Jogi</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link href="/" className="hover:text-primary transition-colors">Adatvédelem</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Felhasználási feltételek</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Cookie szabályzat</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 AquilaHire. Minden jog fenntartva.
            </p>
            <div className="flex gap-6 text-muted-foreground">
              <Users className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
              <TrendingUp className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
              <Globe className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
