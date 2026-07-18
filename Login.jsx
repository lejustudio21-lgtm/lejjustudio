import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, ChevronLeft, Globe } from "lucide-react";
import GoogleIcon from "@/components/GoogleIcon";
import { useLang } from "@/lib/LanguageContext";
import { IMAGES } from "@/lib/images";

export default function Login() {
  const { t, lang, setLang } = useLang();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = "/";
    } catch (err) {
      setError(err.message || t("login.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", "/");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-carbon flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={IMAGES.diamondChrome} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-carbon/80 to-black/95" />
      </div>

      {/* Language toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setLang(lang === "es" ? "en" : "es")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-xs text-silver hover:text-gold transition-colors"
        >
          <Globe size={14} strokeWidth={1.5} />
          {lang === "es" ? "EN" : "ES"}
        </button>
      </div>

      {/* Back link */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card text-xs text-muted-silver hover:text-gold transition-colors"
      >
        <ChevronLeft size={14} strokeWidth={1.5} />
        {t("login.back")}
      </Link>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src={IMAGES.diamondCentered}
            alt="Sello LEJJU"
            className="w-20 h-20 mx-auto rounded-full object-cover ring-1 ring-white/10 animate-float"
          />
          <h1 className="mt-5 text-2xl font-heading font-light tracking-[0.12em] text-gold text-glow-gold">
            {t("login.title")}
          </h1>
          <p className="mt-2 text-sm font-body italic text-muted-silver">
            {t("login.subtitle")}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full h-12 rounded-lg bg-white/[0.03] border border-white/15 text-silver font-heading text-sm tracking-wide hover:bg-white/[0.06] hover:border-white/25 transition-all flex items-center justify-center gap-2"
          >
            <GoogleIcon className="w-5 h-5" />
            {t("login.google")}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-card-dark px-3 text-muted-silver">{t("login.or")}</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-silver text-xs tracking-wider font-heading">
                {t("login.email")}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-silver" aria-hidden="true" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-white/[0.03] border-white/10 text-silver placeholder:text-muted-silver/50"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-muted-silver text-xs tracking-wider font-heading">
                  {t("login.password")}
                </Label>
                <Link to="/forgot-password" className="text-xs text-gold hover:underline">
                  {t("login.forgot")}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-silver" aria-hidden="true" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-white/[0.03] border-white/10 text-silver placeholder:text-muted-silver/50"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-lg bg-gradient-to-r from-white/[0.08] to-white/[0.04] border border-white/20 text-gold font-heading text-sm tracking-wider hover:border-white/40 hover:glow-gold transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("common.loading")}
                </>
              ) : (
                t("login.submit")
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-silver mt-6">
          {t("login.noAccount")}{" "}
          <Link to="/register" className="text-gold hover:underline">
            {t("login.register")}
          </Link>
        </p>
      </div>
    </div>
  );
}