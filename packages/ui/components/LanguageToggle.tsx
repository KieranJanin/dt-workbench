import React from "react";
import { usePhaseStore } from "../../../apps/web/store/usePhaseStore";

export function LanguageToggle() {
  const { language, setLanguage } = usePhaseStore();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fr" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-border text-lg"
      aria-label="Toggle language"
      title={`Switch to ${language === 'en' ? 'French' : 'English'}`}
    >
      {language === "en" ? "🇬🇧" : "🇫🇷"}
    </button>
  );
}
