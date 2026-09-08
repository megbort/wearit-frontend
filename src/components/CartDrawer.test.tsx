import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';
import CartDrawer from './CartDrawer';
import useStore from '../services/store/useStore';
import en from '../../messages/en.json';

const initialState = useStore.getState();

beforeEach(() => {
  useStore.setState(initialState, true);
});

function renderDrawer(open: boolean) {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <CartDrawer open={open} onClose={() => {}} />
    </NextIntlClientProvider>
  );
}

describe('CartDrawer', () => {
  // Regression test: MUI's Drawer/Modal/Portal mount code only runs once
  // `open` is true and the component is actually rendered into a DOM, so a
  // closed-only render (or one that mocks the drawer away) never exercises
  // this path. This is the exact code path that crashed with
  // "Cannot read properties of undefined (reading 'documentElement')".
  it('mounts without throwing when open with an empty cart', () => {
    expect(() => renderDrawer(true)).not.toThrow();
    expect(screen.getByText(en.CartDrawer.empty)).not.toBeNull();
  });

  it('mounts without throwing when open with items in the cart', () => {
    useStore.getState().addItem({
      productId: 'p1',
      size: 'M',
      color: 'red',
      product: { name: 'Tee', price: 20, effectivePrice: 16, image: '/tee.jpg' },
    });

    expect(() => renderDrawer(true)).not.toThrow();
    expect(screen.getByText('Tee')).not.toBeNull();
    expect(screen.getAllByText('$16.00').length).toBeGreaterThan(0);
  });

  it('does not throw while closed', () => {
    expect(() => renderDrawer(false)).not.toThrow();
  });
});
