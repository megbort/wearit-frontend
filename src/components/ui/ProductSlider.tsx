'use client';

import React, { useMemo, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import useStore from '@/services/store/useStore';
import { useProducts } from '@/hooks/useProducts';
import ProductMiniCard from '@/components/ui/ProductMiniCard';

interface ProductSliderProps {
  currentId: string;
}

export default function ProductSlider({ currentId }: Readonly<ProductSliderProps>) {
  const storeProducts = useStore((state) => state.products);
  const setProducts = useStore((state) => state.setProducts);
  const { products: fetchedProducts, loading } = useProducts();

  useEffect(() => {
    if (storeProducts.length === 0 && fetchedProducts.length > 0) {
      setProducts(fetchedProducts);
    }
  }, [fetchedProducts, storeProducts.length, setProducts]);

  const source = storeProducts.length > 0 ? storeProducts : fetchedProducts;

  const products = useMemo(() => {
    return source.filter((product) => product.id !== currentId).slice(0, 8);
  }, [source, currentId]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4, slidesToScroll: 1 },
      },
    ],
  };

  if (loading && storeProducts.length === 0) {
    return (
      <div className="flex gap-4">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="w-[140px] h-[120px] rounded-lg bg-neutral-200 dark:bg-zinc-700 animate-pulse shrink-0"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <Slider {...settings}>
      {products.map((product) => (
        <div key={product.id} className="flex justify-center px-2">
          <ProductMiniCard product={product} />
        </div>
      ))}
    </Slider>
  );
}
