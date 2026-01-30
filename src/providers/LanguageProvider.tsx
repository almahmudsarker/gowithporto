"use client";

import { createContext, useContext, useState } from "react";

type Lang = "en" | "pt" | "fr" | "es" | "de";

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
}>({
  lang: "en",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
