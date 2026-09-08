'use client';

import { Product } from '@/services/models/product';
import Image from 'next/image';
import Link from 'next/link';

interface ProductMiniCardProps {
  product: Product;
}

export default function ProductMiniCard({ product }: Readonly<ProductMiniCardProps>) {
  return (
    <Link href={`/product/${product.id}`}>
      <div className="w-[140px] h-[120px] relative rounded-lg border dark:border-zinc-600 hover:cursor-pointer overflow-hidden">
        {product.sale && (product.discountPercent ?? 0) > 0 && (
          <div className="absolute top-0 right-0 z-10 rounded-tr rounded-bl bg-wearit-red text-wearit-white text-sm px-1.5 py-0.5">
            Sale
          </div>
        )}
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="140px"
          className="object-cover"
        />
      </div>
    </Link>
  );
}
