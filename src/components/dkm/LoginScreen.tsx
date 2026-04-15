import { useState } from "react";
import { Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginScreen() {
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    if (!email.trim()) {
      alert("Silakan isi email terlebih dahulu.");
      return;
    }
    alert(
      "UI login sudah aktif, tetapi endpoint login di Apps Script belum disambungkan di frontend ini. Langkah berikutnya adalah menambahkan API login dan panel internal."
    );
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <section className="bg-card rounded-3xl border border-border p-6 shadow-card">
        <div className="mb-6">
          <div className="w-12 h-12 rounded-2xl bg-dkm-green-soft flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-heading text-xl font-bold text-foreground">
            Masuk ke Panel Internal
          </h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Bendahara dan pengurus memakai panel yang lebih cepat untuk input dan monitoring.
          </p>
        </div>

        <label htmlFor="emailInput" className="block text-xs font-semibold text-muted-foreground mb-2">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="emailInput"
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-11 h-12 rounded-2xl bg-background border-border text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
          Login akan diproses lewat backend Apps Script agar data dan role tetap aman.
        </p>

        <Button
          onClick={handleLogin}
          className="w-full mt-5 h-12 rounded-2xl bg-gradient-to-b from-primary to-dkm-green-strong
                     text-primary-foreground font-bold text-sm shadow-soft hover:shadow-elevated
                     transition-all duration-200 active:scale-[0.98]"
        >
          Lanjut Masuk
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </section>
    </div>
  );
}
