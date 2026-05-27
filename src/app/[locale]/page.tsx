import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/lib/categories";
import { getContributors } from "@/lib/contributors";

export default async function HomePage() {
  const t = await getTranslations("home");
  const locale = await getLocale();

  const contributors = await getContributors();

  const steps = [
    {
      num: "01",
      icon: "📖",
      title: t("step1Title"),
      desc: t("step1Desc"),
      tag: t("step1Tag"),
      accent: "text-blue-400",
      border: "border-blue-500/20",
    },
    {
      num: "02",
      icon: "🃏",
      title: t("step2Title"),
      desc: t("step2Desc"),
      tag: t("step2Tag"),
      accent: "text-purple-400",
      border: "border-purple-500/20",
    },
    {
      num: "03",
      icon: "✅",
      title: t("step3Title"),
      desc: t("step3Desc"),
      tag: t("step3Tag"),
      accent: "text-green-400",
      border: "border-green-500/20",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Hero */}
      <section className="relative text-center mb-24 pt-8 pb-4 overflow-hidden">
        {/* Glow */}
        <div
          className="absolute inset-0 flex items-start justify-center pointer-events-none"
          style={{
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 35%, black, transparent)",
          }}
        >
          <div className="w-[600px] h-[320px] bg-blue-600/15 rounded-full blur-3xl translate-y-4" />
        </div>

        <div className="relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-dark-border bg-dark-surface rounded-full px-4 py-1.5 text-xs font-mono text-dark-muted mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            {t("badge")}
          </div>

          {/* Title */}
          <h1 className="font-mono text-4xl sm:text-6xl font-bold mb-8 leading-none tracking-tight">
            <span className="text-dark-heading">code</span>
            <span className="text-blue-400">questions</span>
          </h1>

          {/* Tagline */}
          <p className="text-2xl font-semibold text-dark-heading mb-2 leading-snug">
            {t("tagline1")}
          </p>
          <p className="text-base text-dark-muted mb-10">{t("tagline2")}</p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href={`/${locale}/questions`}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-sm"
            >
              {t("browse")}
            </Link>
            <Link
              href={`/${locale}/contribute`}
              className="border border-dark-border hover:border-blue-500/50 text-dark-muted hover:text-dark-heading px-6 py-3 rounded-lg transition-colors text-sm"
            >
              {t("contribute")}
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mb-24">
        <h2 className="text-center text-xs font-mono uppercase tracking-widest text-dark-muted mb-10">
          {t("howItWorks")}
        </h2>

        <div className="grid md:grid-cols-3 gap-px bg-dark-border rounded-xl overflow-hidden border border-dark-border">
          {steps.map((step) => (
            <div
              key={step.num}
              className={`bg-dark-bg p-8 flex flex-col border-t-2 ${step.border}`}
            >
              <div className="text-3xl mb-5">{step.icon}</div>
              <div
                className={`text-xs font-mono ${step.accent} mb-3 tracking-widest`}
              >
                {step.num}
              </div>
              <h3 className="font-semibold text-dark-heading text-base mb-3 leading-snug">
                {step.title}
              </h3>
              <p className="text-sm text-dark-muted leading-relaxed flex-1">
                {step.desc}
              </p>
              <div
                className={`mt-6 pt-4 border-t border-dark-border/50 text-xs font-mono ${step.accent} opacity-70`}
              >
                {step.tag}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category pills */}
      <section className="mb-24">
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${locale}/questions/${cat.slug}`}
              className={`inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full border ${cat.borderColor} ${cat.color} bg-dark-surface hover:opacity-80 transition-opacity`}
            >
              <span>{cat.icon}</span>
              <span>{cat.slug}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Contributors */}
      {contributors.length > 0 && (
        <section className="mb-24">
          <h2 className="text-center text-xs font-mono uppercase tracking-widest text-dark-muted mb-10">
            {t("contributors")}
          </h2>
          <p className="text-center text-sm text-dark-muted mb-8">
            {t("contributorsDesc")}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {contributors.map((c) => (
              <a
                key={c.login}
                href={c.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
                title={c.login}
              >
                <Image
                  src={c.avatar_url}
                  alt={c.login}
                  width={56}
                  height={56}
                  className="rounded-full border-2 border-dark-border group-hover:border-blue-500/60 transition-colors"
                />
                <span className="text-xs font-mono text-dark-muted group-hover:text-dark-heading transition-colors">
                  @{c.login}
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Contribute CTA */}
      <section className="bg-dark-surface border border-dark-border rounded-lg p-8 text-center">
        <h2 className="text-dark-heading font-semibold text-lg mb-2">
          {t("ctaTitle")}
        </h2>
        <p className="text-dark-muted text-sm mb-6 max-w-md mx-auto">
          {t("ctaDesc")}
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href={`/${locale}/contribute`}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2 rounded transition-colors"
          >
            {t("ctaContribute")}
          </Link>
          <Link
            href={`/${locale}/support`}
            className="border border-dark-border text-dark-muted hover:text-dark-heading text-sm px-5 py-2 rounded transition-colors"
          >
            {t("ctaSupport")}
          </Link>
        </div>
      </section>
    </div>
  );
}
