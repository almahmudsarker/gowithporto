import { useState } from "react";

export function useLanguage() {
  const [lang, setLang] = useState("en");
  return { lang, setLang };
}
