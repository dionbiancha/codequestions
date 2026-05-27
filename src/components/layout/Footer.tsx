"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

const LOCALES = [
  { code: "en", label: "English" },
  { code: "pt", label: "Português" },
];

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (target: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${target}`);
    router.push(newPath);
  };

  return (
    <footer className="border-t border-dark-border mt-auto py-12 pb-20 md:pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-mono font-bold text-blue-400 text-base">
              codequestions
            </span>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-dark-muted mb-3">
              Menu
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href={`/${locale}/questions`}
                  className="text-sm text-dark-text hover:text-dark-heading transition-colors"
                >
                  {nav("questions")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/storytelling`}
                  className="text-sm text-dark-text hover:text-dark-heading transition-colors"
                >
                  {nav("storytelling")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/resume`}
                  className="text-sm text-dark-text hover:text-dark-heading transition-colors"
                >
                  {nav("resume")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Project */}
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-dark-muted mb-3">
              Projeto
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href={`/${locale}/support`}
                  className="text-sm text-dark-text hover:text-dark-heading transition-colors"
                >
                  {nav("support")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-sm text-dark-text hover:text-dark-heading transition-colors"
                >
                  {nav("about")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contribute`}
                  className="text-sm text-dark-text hover:text-dark-heading transition-colors"
                >
                  {nav("contribute")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Language */}
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-dark-muted mb-3">
              Idioma
            </p>
            <ul className="flex flex-col gap-2">
              {LOCALES.map((l) => (
                <li key={l.code}>
                  <button
                    onClick={() => switchLocale(l.code)}
                    className={`text-sm transition-colors ${
                      locale === l.code
                        ? "text-blue-400"
                        : "text-dark-text hover:text-dark-heading"
                    }`}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-border pt-6 text-xs text-dark-muted font-mono">
          © {new Date().getFullYear()} codequestions
        </div>
      </div>
    </footer>
  );
}
