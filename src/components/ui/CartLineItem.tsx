'use client';

import Image from 'next/image';
import { Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import type { CartItem } from '@/services/models/cart';

const MIN_QUANTITY = 1;
const THUMBNAIL_SIZE = 96;

interface CartLineItemProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

const CartLineItem: React.FC<CartLineItemProps> = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}) => {
  const translate = useTranslations('CartDrawer');
  const colorLabel = item.color.charAt(0).toUpperCase() + item.color.slice(1);

  return (
    <li className="flex gap-3">
      <div
        className="relative shrink-0"
        style={{ width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE }}
      >
        <Image
          src={item.product.image}
          alt={item.product.name}
          fill
          sizes={`${THUMBNAIL_SIZE}px`}
          style={{ objectFit: 'cover' }}
          className="rounded"
        />
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex justify-between items-start gap-2">
          <Typography className="text-wearit-black dark:text-wearit-white font-semibold">
            {item.product.name}
          </Typography>
          <Typography className="text-wearit-black dark:text-wearit-white whitespace-nowrap">
            ${(item.product.price * item.quantity).toFixed(2)}
          </Typography>
        </div>
        <Typography className="text-caption text-wearit-grey-darker">
          {colorLabel} | {item.size.toUpperCase()}
        </Typography>
        <div className="flex items-center gap-2 mt-1">
          <button
            className="w-6 h-6 border border-wearit-grey-dark dark:border-zinc-400 text-wearit-grey-dark dark:text-zinc-400 hover:border-wearit-red hover:text-wearit-red"
            onClick={() => onDecrement()}
            disabled={item.quantity <= MIN_QUANTITY}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="text-wearit-black dark:text-wearit-white w-4 text-center">
            {item.quantity}
          </span>
          <button
            className="w-6 h-6 border border-wearit-grey-dark dark:border-zinc-400 text-wearit-grey-dark dark:text-zinc-400 hover:border-wearit-red hover:text-wearit-red"
            onClick={() => onIncrement()}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          className="text-caption text-wearit-red underline hover:text-wearit-pink text-left w-fit"
          onClick={() => onRemove()}
        >
          {translate('remove')}
        </button>
      </div>
    </li>
  );
};

export default CartLineItem;
