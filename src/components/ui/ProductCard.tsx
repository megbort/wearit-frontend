'use client';

import { Product } from '@/services/models/product';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: Readonly<ProductCardProps>) {
  const translate = useTranslations('ProductCard');

  return (
    <Link href={`product/${product.id}`}>
      <div className="relative w-[280px] h-[280px] flex flex-col justify-between bg-neutral-100 dark:bg-zinc-800 rounded-lg border dark:border-zinc-600 hover:border-neutral-600 hover:cursor-pointer hover:bg-transparent dark:hover:bg-zinc-700">
        {product.sale && (product.discountPercent ?? 0) > 0 && (
          <div className="absolute top-0 right-0 z-50 rounded-tr-lg bg-wearit-red text-wearit-white w-[80px] p-1 text-center">
            {translate('sale')}
          </div>
        )}
        <div className="h-[230px] relative">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover rounded-t-lg"
          />
        </div>
        <div className="h-[70px] text-center p-2 flex flex-col justify-center">
          <p className="text-body-1">{product.name}</p>
          <div className="flex gap-2 justify-center">
            {product.sale && (product.discountPercent ?? 0) > 0 ? (
              <>
                <p className="text-body-1 text-neutral-600 dark:text-zinc-400 line-through">
                  ${product.price}
                </p>
                <p className="text-body-1 text-wearit-red">
                  ${(product.effectivePrice ?? product.price).toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-body-1 text-neutral-600 dark:text-zinc-400">${product.price}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
