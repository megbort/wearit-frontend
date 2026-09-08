import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';
import Navbar from './Navbar';
import useStore from '../services/store/useStore';
import en from '../../messages/en.json';

vi.mock('../services/apollo/client', () => ({
  default: { mutate: vi.fn(), query: vi.fn(), clearStore: vi.fn() },
  setAccessToken: vi.fn(),
  getAccessToken: vi.fn(),
}));

// next/image's loader needs an absolute URL or Next's runtime config to
// resolve the logo's relative Cloudinary path; neither is available under
// vitest, and the logo itself is irrelevant to this regression.
vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

const initialState = useStore.getState();

beforeEach(() => {
  useStore.setState(initialState, true);
});

function renderNavbar() {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <Navbar />
    </NextIntlClientProvider>
  );
}

describe('Navbar', () => {
  // Regression test: like CartDrawer's <Drawer>, MUI's <Menu> is also built
  // on the shared Modal/Portal machinery that crashed with
  // "Cannot read properties of undefined (reading 'documentElement')" —
  // that mount code only runs once a menu is actually opened.
  it('opens the account menu without throwing', () => {
    renderNavbar();

    expect(() =>
      fireEvent.click(screen.getByLabelText('Account menu'))
    ).not.toThrow();
    expect(screen.getByText(en.Navbar.login)).not.toBeNull();
  });

  it('opens the mobile menu without throwing', () => {
    renderNavbar();

    expect(() =>
      fireEvent.click(screen.getByLabelText('Open menu'))
    ).not.toThrow();
  });
});
