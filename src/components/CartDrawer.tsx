'use client';

import React from 'react';
import { Drawer, Typography, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';
import useStore from '@/services/store/useStore';
import { useCart } from '@/hooks/useCart';
import CartLineItem from '@/components/ui/CartLineItem';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MIN_QUANTITY = 1;

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const translate = useTranslations('CartDrawer');
  const cart = useStore((state) => state.cart);
  const { removeItem, updateQuantity } = useCart();

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        className: 'w-full sm:w-[400px] bg-wearit-white dark:bg-zinc-900',
      }}
    >
      <div className="flex flex-col h-full p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-wearit-grey dark:border-zinc-700 pb-4">
          <Typography
            variant="h6"
            className="font-bold text-wearit-black dark:text-wearit-white"
            style={{ fontFamily: 'var(--font-comfortaa)' }}
          >
            {translate('title')}
          </Typography>
          <IconButton onClick={onClose} className="text-wearit-red hover:text-wearit-green">
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <Typography className="text-wearit-grey-darker text-center mt-8">
              {translate('empty')}
            </Typography>
          ) : (
            <ul className="flex flex-col gap-4">
              {cart.map((item) => (
                <CartLineItem
                  key={`${item.productId}-${item.size}-${item.color}`}
                  item={item}
                  onIncrement={() =>
                    updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                  }
                  onDecrement={() =>
                    updateQuantity(
                      item.productId,
                      item.size,
                      item.color,
                      Math.max(MIN_QUANTITY, item.quantity - 1)
                    )
                  }
                  onRemove={() => removeItem(item.productId, item.size, item.color)}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Checkout Section */}
        <div className="border-t border-wearit-grey dark:border-zinc-700 pt-4 mt-4">
          {/* Total */}
          <div className="flex justify-between items-center mb-4">
            <Typography
              variant="h6"
              className="font-bold text-wearit-black dark:text-wearit-white"
              style={{ fontFamily: 'var(--font-comfortaa)' }}
            >
              {translate('total')}
            </Typography>
            <Typography
              variant="h6"
              className="font-bold text-wearit-black dark:text-wearit-white"
              style={{ fontFamily: 'var(--font-comfortaa)' }}
            >
              ${total.toFixed(2)}
            </Typography>
          </div>

          {/* Checkout Button (not wired up yet) */}
          <button
            className="w-full bg-wearit-red hover:bg-wearit-pink text-white font-bold py-3 px-4 rounded transition-colors duration-200 mb-3 disabled:opacity-50"
            disabled
          >
            {translate('checkout')}
          </button>

          {/* Shipping Note */}
          <Typography className="text-wearit-grey-darker text-sm">
            {translate('taxNote')}
          </Typography>
        </div>
      </div>
    </Drawer>
  );
};

export default CartDrawer;
