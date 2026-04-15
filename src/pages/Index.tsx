import { useState, useEffect, useCallback } from "react";
import { BottomNav, type Screen } from "@/components/dkm/BottomNav";
import { HomeScreen } from "@/components/dkm/HomeScreen";
import { EventScreen } from "@/components/dkm/EventScreen";
import { LoginScreen } from "@/components/dkm/LoginScreen";
import { loadPublicData, type PublicData } from "@/lib/api";
import { LogIn } from "lucide-react";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("home");
  const [data, setData] = useState<PublicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPublicData()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const navigate = useCallback((s: Screen) => {
    setScreen(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[520px] mx-auto px-4 pt-3 pb-28">
        {/* Header */}
        <header className="flex items-start justify-between gap-4 py-2 mb-4">
          <div className="max-w-[320px]">
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">
              Transparansi Keuangan Mushola
            </div>
            <h1 className="mt-1.5 font-heading text-[26px] leading-[1.05] font-bold text-foreground tracking-tight">
              Mushola Raudhatul Mukminin
            </h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Pantau kondisi kas, progres qurban, dan kebutuhan event dengan cepat dari HP.
            </p>
          </div>
          <button
            onClick={() => navigate("login")}
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full
                       bg-gradient-to-b from-primary to-dkm-green-strong
                       text-primary-foreground font-bold text-sm shadow-soft
                       transition-all duration-200 hover:shadow-elevated active:scale-[0.97]"
          >
            <LogIn className="w-4 h-4" />
            Login
          </button>
        </header>

        {/* Screen Content */}
        <main>
          {screen === "home" && <HomeScreen data={data} loading={loading} error={error} />}
          {screen === "event" && <EventScreen data={data} loading={loading} />}
          {screen === "login" && <LoginScreen />}
        </main>

        {/* FAB */}
        <button
          onClick={() => navigate("login")}
          className="fixed right-[max(18px,calc((100vw-520px)/2+18px))] bottom-24 z-10
                     w-12 h-12 rounded-2xl bg-foreground text-background
                     shadow-elevated flex items-center justify-center
                     transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label="Aksi cepat"
        >
          <img src="/icons/plus.svg" alt="" className="w-5 h-5 invert" />
        </button>
      </div>

      <BottomNav active={screen} onNavigate={navigate} />
    </div>
  );
};

export default Index;
