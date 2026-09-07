import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useTranslations } from 'next-intl';
import IntlProvider from './IntlProvider';
import en from '../../messages/en.json';

function setNavigatorLanguage(language: string) {
  Object.defineProperty(window.navigator, 'language', {
    value: language,
    configurable: true,
  });
}

function LoginLabel() {
  const translate = useTranslations('Navbar');
  return <span>{translate('login')}</span>;
}

afterEach(() => {
  document.documentElement.lang = '';
});

describe('IntlProvider', () => {
  it('keeps the initial locale when the browser language is not supported', async () => {
    setNavigatorLanguage('de-DE');

    render(
      <IntlProvider initialLocale="en" initialMessages={en}>
        <LoginLabel />
      </IntlProvider>
    );

    expect(screen.getByText('Login')).not.toBeNull();
    expect(document.documentElement.lang).not.toBe('fr');
  });

  it('switches to fr messages when the browser language is French', async () => {
    setNavigatorLanguage('fr-FR');

    render(
      <IntlProvider initialLocale="en" initialMessages={en}>
        <LoginLabel />
      </IntlProvider>
    );

    await waitFor(() => expect(screen.getByText('Connexion')).not.toBeNull());
    expect(document.documentElement.lang).toBe('fr');
  });
});
