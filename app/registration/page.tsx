"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageSquare, Loader2, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { signIn } from "next-auth/react";
import { useToast } from "../hooks/use-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false); // form submit
  const [isSocialLoading, setIsSocialLoading] = useState(false); // Google gomb

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    terms?: string;
  }>({});

  const router = useRouter();
  const { toast } = useToast();

  const getPasswordStrength = (
    pwd: string
  ): { label: string; color: string; strength: number } => {
    if (pwd.length === 0) return { label: "", color: "", strength: 0 };
    if (pwd.length < 6)
      return { label: "Gyenge", color: "text-destructive", strength: 1 };
    if (pwd.length < 10)
      return { label: "Közepes", color: "text-yellow-500", strength: 2 };
    return { label: "Erős", color: "text-green-500", strength: 3 };
  };

  const passwordStrength = getPasswordStrength(password);

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      terms?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = "A név megadása kötelező";
    }

    if (!email) {
      newErrors.email = "Az email cím megadása kötelező";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Érvénytelen email formátum";
    }

    if (!password) {
      newErrors.password = "A jelszó megadása kötelező";
    } else if (password.length < 6) {
      newErrors.password = "A jelszónak legalább 6 karakter hosszúnak kell lennie";
    }

    if (!acceptTerms) {
      newErrors.terms = "El kell fogadnod a felhasználási feltételeket";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Itt majd jöhet a valódi backend / NextAuth credentials stb.
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsLoading(false);
      toast({
        title: "Sikeres regisztráció! (demo)",
        description: "Átirányítás a bejelentkezésre...",
      });

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Hiba történt",
        description: "Próbáld újra később",
        variant: "destructive",
      });
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setIsSocialLoading(true);
      // ugyanaz, mint a login: Google OAuth + vissza a dashboardra
      await signIn("google", { callbackUrl: "/dashboard" });
      // redirect miatt ide valószínűleg nem jutunk vissza
    } catch (err) {
      setIsSocialLoading(false);
      toast({
        title: "Google regisztráció sikertelen",
        description: "Kérlek, próbáld újra később.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-primary">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-2xl text-gradient-primary">
            MockHire
          </span>
        </div>

        <Card className="shadow-lg border-border/50 bg-card/95 backdrop-blur">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Hozz létre MockHire fiókot
            </CardTitle>
            <CardDescription className="text-center">
              Gyakorold az állásinterjúkat AI segítségével, magyar nyelven
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleRegister}
              disabled={isSocialLoading}
            >
              {isSocialLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Google regisztráció...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Regisztráció Google fiókkal
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  vagy email címmel
                </span>
              </div>
            </div>

            {/* Register Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Teljes név</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Kovács János"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email cím</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="pelda@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Jelszó</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Legalább 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? "border-destructive" : ""}
                />
                {password && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          passwordStrength.strength === 1
                            ? "bg-destructive w-1/3"
                            : passwordStrength.strength === 2
                            ? "bg-yellow-500 w-2/3"
                            : "bg-green-500 w-full"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium ${passwordStrength.color}`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) =>
                      setAcceptTerms(Boolean(checked))
                    }
                    className={errors.terms ? "border-destructive" : ""}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Elfogadom a{" "}
                    <a href="#" className="text-primary hover:underline">
                      felhasználási feltételeket
                    </a>{" "}
                    és az{" "}
                    <a href="#" className="text-primary hover:underline">
                      adatvédelmi szabályzatot
                    </a>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-sm text-destructive">{errors.terms}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full shadow-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Regisztráció...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Regisztráció
                  </>
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Már van fiókod?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Bejelentkezés
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4 max-w-sm mx-auto">
          A MockHire egy AI alapú gyakorló platform. Az adataid biztonságosan
          vannak tárolva.
        </p>
      </div>
    </div>
  );
};

export default Register;
