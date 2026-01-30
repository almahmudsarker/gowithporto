"use client";

import Grid from "@/components/layout/Grid";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { t } from "@/i18n";
import { useLanguage } from "@/providers/LanguageProvider";
import { useTheme } from "next-themes";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useLanguage();

  return (
    <main className="p-8 space-y-14 transition-colors">
      {/* HERO */}
      <section className="relative rounded-3xl border border-black/5 bg-[var(--card)] p-10 shadow-sm">
        {/* UI Controls — HERO ONLY */}
        <div className="absolute right-6 top-6 flex gap-3">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-xl border px-4 py-2 text-sm hover:scale-105 transition"
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>

          {/* Language Switch */}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
            className="rounded-xl border px-3 py-2 text-sm bg-transparent"
          >
            <option value="en">EN</option>
            <option value="pt">PT</option>
            <option value="fr">FR</option>
            <option value="es">ES</option>
            <option value="de">DE</option>
          </select>
        </div>

        <h1 className="text-5xl font-serif text-primary">
          {t(lang, "home.title")}
        </h1>

        <p className="mt-3 text-lg opacity-80">{t(lang, "home.subtitle")}</p>

        <div className="mt-8 flex gap-4">
          <Button>{t(lang, "home.cta")}</Button>
          <Button variant="secondary">{t(lang, "home.explore")}</Button>
        </div>
      </section>

      {/* CARDS */}
      <Grid>
        <Card>
          <h3 className="font-serif text-xl">{t(lang, "home.card.ai")}</h3>
          <p className="mt-2 text-sm opacity-80">
            {t(lang, "home.card.ai.desc")}
          </p>
        </Card>

        <Card>
          <h3 className="font-serif text-xl">{t(lang, "home.card.guides")}</h3>
          <p className="mt-2 text-sm opacity-80">
            {t(lang, "home.card.guides.desc")}
          </p>
        </Card>

        <Card>
          <h3 className="font-serif text-xl">
            {t(lang, "home.card.souvenirs")}
          </h3>
          <p className="mt-2 text-sm opacity-80">
            {t(lang, "home.card.souvenirs.desc")}
          </p>
        </Card>
      </Grid>
    </main>
  );
}
