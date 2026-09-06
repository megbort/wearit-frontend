'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import BoxSelect from '@/components/ui/BoxSelect';
import CustomButton from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import useStore from '@/services/store/useStore';
import type { Product } from '@/services/models/product';

interface ProductAddToCartProps {
  product: Product;
}

export default function ProductAddToCart({
  product,
}: Readonly<ProductAddToCartProps>) {
  const t = useTranslations('ProductPage');
  const { addItem } = useCart();
  const setNotification = useStore((state) => state.setNotification);

  const [size, setSize] = useState(product.sizes[0] ?? '');
  const [color, setColor] = useState(product.colors[0] ?? '');
  const [adding, setAdding] = useState(false);

  const colorSelect = {
    title: 'Color',
    boxSize: 75,
    items: product.colors.map((c, index) => ({
      value: c.charAt(0).toUpperCase() + c.slice(1),
      selected: index === 0,
    })),
  };

  const sizeSelect = {
    title: 'Size',
    boxSize: 40,
    items: product.sizes.map((s, index) => ({
      value: s.toUpperCase(),
      selected: index === 0,
    })),
  };

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addItem(product, size, color);
      setNotification({ message: t('addedToCart'), severity: 'success' });
    } catch {
      // useCart already surfaces an error notification
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <BoxSelect
        {...colorSelect}
        onChange={(value) => setColor(value.toLowerCase())}
      />
      <BoxSelect
        {...sizeSelect}
        onChange={(value) => setSize(value.toLowerCase())}
      />
      <div className="max-[250px]">
        <CustomButton
          variant="primary"
          onClick={handleAddToCart}
          disabled={adding}
        >
          {t('addToCart')}
        </CustomButton>
      </div>
    </>
  );
}
