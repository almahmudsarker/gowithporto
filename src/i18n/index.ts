import de from "./de.json";
import en from "./en.json";
import es from "./es.json";
import fr from "./fr.json";
import pt from "./pt.json";

export const languages: any = { en, pt, fr, es, de };

export const t = (lang: string, key: string) => languages[lang]?.[key] || key;
