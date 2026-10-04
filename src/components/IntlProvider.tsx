'use client';

import { useEffect, useState } from 'react';
import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl';

const SUPPORTED_LOCALES = ['en', 'fr'] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];
const TIME_ZONE = 'UTC';

function detectLocale(): Locale {
  const lang = navigator.language.toLowerCase();
  return SUPPORTED_LOCALES.find((locale) => lang.startsWith(locale)) ?? 'en';
}

export default function IntlProvider({
  initialLocale,
  initialMessages,
  children,
}: {
  initialLocale: Locale;
  initialMessages: AbstractIntlMessages;
  children: React.ReactNode;
}) {
  const [locale, setLocale] = useState(initialLocale);
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    const detected = detectLocale();
    if (detected === locale) return;

    let cancelled = false;
    import(`../../messages/${detected}.json`).then((mod) => {
      if (cancelled) return;
      setLocale(detected);
      setMessages(mod.default);
      document.documentElement.lang = detected;
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NextIntlClientProvider locale={locale} timeZone={TIME_ZONE} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
