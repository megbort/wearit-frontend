'use client';

import ProductCard from './ui/ProductCard';
import ProductCardSkeleton from './ui/ProductCardSkeleton';
import CustomButton from './ui/Button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useFeaturedProducts } from '@/hooks/useProducts';

export default function Featured() {
  const translate = useTranslations('Featured');
  const { products, loading } = useFeaturedProducts();

  const renderSkeletons = () => {
    return Array.from({ length: 8 }, (_, index) => (
      <ProductCardSkeleton key={`skeleton-${index}`} />
    ));
  };

  return (
    <div className="py-12 flex flex-col items-center dark:bg-zinc-900 dark:text-wearit-white">
      <h3 className="pb-8 px-4 font-bold">{translate('heading')}</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
        {loading
          ? renderSkeletons()
          : products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
      <div className="py-8">
        <Link href={'products'}>
          <CustomButton variant="primary">{translate('viewMore')}</CustomButton>
        </Link>
      </div>
    </div>
  );
}
