import { useState, useEffect, useCallback, useRef } from "react";
import { BottomNav, type Screen } from "@/components/dkm/BottomNav";
import { HomeScreen } from "@/components/dkm/HomeScreen";
import { EventScreen } from "@/components/dkm/EventScreen";
import { LoginScreen } from "@/components/dkm/LoginScreen";
import { HomeScreenSkeleton, EventScreenSkeleton } from "@/components/dkm/Skeletons";
import { loadPublicData, type PublicData } from "@/lib/api";
import { LogIn, RefreshCw } from "lucide-react";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("home");
  const [data, setData] = useState<PublicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Pull-to-refresh state
  const containerRef = useRef<HTMLDivElement>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const touchStartY = useRef(0);
  const PULL_THRESHOLD = 80;

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const result = await loadPublicData();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const navigate = useCallback((s: Screen) => {
    setScreen(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Pull-to-refresh handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || refreshing) return;
    const deltaY = e.touches[0].clientY - touchStartY.current;
    if (deltaY > 0 && window.scrollY === 0) {
      setPullDistance(Math.min(deltaY * 0.5, 120));
    }
  }, [isPulling, refreshing]);

  const handleTouchEnd = useCallback(() => {
    if (pullDistance >= PULL_THRESHOLD && !refreshing) {
      fetchData(true);
    }
    setPullDistance(0);
    setIsPulling(false);
  }, [pullDistance, refreshing, fetchData]);

  const showSkeleton = loading && !data;

  return (
    <div
      className="min-h-screen bg-background"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull-to-refresh indicator */}
      <div
        className="flex items-center justify-center overflow-hidden transition-all duration-200"
        style={{ height: pullDistance > 10 ? pullDistance : 0 }}
      >
        <RefreshCw
          className={`w-5 h-5 text-primary transition-transform duration-200 ${
            refreshing ? "animate-spin" : ""
          } ${pullDistance >= PULL_THRESHOLD ? "text-primary scale-110" : "text-muted-foreground"}`}
          style={{
            transform: refreshing ? undefined : `rotate(${pullDistance * 3}deg)`,
          }}
        />
      </div>

      {/* Refreshing banner */}
      {refreshing && (
        <div className="flex items-center justify-center py-2 bg-dkm-green-soft">
          <RefreshCw className="w-4 h-4 text-primary animate-spin mr-2" />
          <span className="text-xs font-semibold text-primary">Memperbarui data...</span>
        </div>
      )}

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
          {screen === "home" && (
            showSkeleton ? <HomeScreenSkeleton /> : <HomeScreen data={data} loading={loading} error={error} />
          )}
          {screen === "event" && (
            showSkeleton ? <EventScreenSkeleton /> : <EventScreen data={data} loading={loading} />
          )}
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
