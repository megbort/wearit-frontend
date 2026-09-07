'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ui/ProductCard';
import ProductCardSkeleton from '../../components/ui/ProductCardSkeleton';
import CustomButton from '../../components/ui/Button';
import SelectDropdown from '../../components/ui/Select';
import { CategoryType } from '@/services/models/category';
import { useTranslations } from 'next-intl';
import { useProducts } from '@/hooks/useProducts';
import useStore from '@/services/store/useStore';

export default function Products() {
  const translate = useTranslations('ProductsPage');
  const { products: allProducts, loading: productsLoading } = useProducts();
  const setProducts = useStore((state) => state.setProducts);

  useEffect(() => {
    if (allProducts.length > 0) {
      setProducts(allProducts);
    }
  }, [allProducts, setProducts]);

  const sortBySelect = {
    placeholder: translate('sortPlaceholder'),
    items: [
      { value: 'all', label: translate('allProducts') },
      { value: 'featured', label: translate('featured') },
      { value: 'sale', label: translate('onSale') },
      { value: 'priceHigh', label: translate('priceHighToLow') },
      { value: 'priceLow', label: translate('priceLowToHigh') },
    ],
  };

  const categorySelect = {
    placeholder: translate('categoryPlaceholder'),
    items: [
      { value: 'all', label: translate('allCategories') },
      { value: CategoryType.Pants, label: translate('pants') },
      { value: CategoryType.Tees, label: translate('tees') },
      { value: CategoryType.Sweaters, label: translate('sweaters') },
      { value: CategoryType.Shorts, label: translate('shorts') },
      { value: CategoryType.Jackets, label: translate('jackets') },
    ],
  };

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(8);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(8);
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    setVisibleCount(8);
  };

  const getFilteredProducts = () => {
    let filteredProducts = allProducts.filter(
      (product) =>
        selectedCategory === 'all' || product.category === selectedCategory
    );
    if (selectedSort === 'sale') {
      filteredProducts = filteredProducts.filter((product) => product.sale);
    } else if (selectedSort === 'featured') {
      filteredProducts = filteredProducts.filter((product) => product.featured);
    } else if (selectedSort === 'priceHigh') {
      filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'priceLow') {
      filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
    }
    return filteredProducts;
  };

  const filteredProducts = getFilteredProducts();
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const showMoreProducts = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const renderSkeletons = () => {
    return Array.from({ length: visibleCount }, (_, index) => (
      <div key={`skeleton-${index}`} className="flex justify-center">
        <ProductCardSkeleton />
      </div>
    ));
  };

  return (
    <div className="py-12 mb-8 px-2 md:px-10 w-full lg:max-w-5xl xl:max-w-7xl mx-auto dark:bg-zinc-900 dark:text-wearit-white">
      <header className="p-4 text-center">
        <h3 className="font-bold">{translate('heading')}</h3>
      </header>
      <div className="flex flex-col sm:flex-row justify-between items-center pb-12">
        <div className="flex flex-col md:flex-row">
          <SelectDropdown
            placeholder={categorySelect.placeholder}
            items={categorySelect.items}
            value={selectedCategory}
            onChange={(event) => handleCategoryChange(event.target.value)}
          />
          <CustomButton
            variant="text"
            onClick={() => setSelectedCategory('all')}
          >
            {translate('clearCategory')}
          </CustomButton>
        </div>
        <div className="flex flex-col-reverse md:flex-row">
          <CustomButton variant="text" onClick={() => setSelectedSort('all')}>
            {translate('clearSort')}
          </CustomButton>
          <SelectDropdown
            placeholder={sortBySelect.placeholder}
            items={sortBySelect.items}
            value={selectedSort}
            onChange={(event) => handleSortChange(event.target.value)}
          />
        </div>
      </div>
      <div className="grid gap-4 md:gap-8 lg:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {productsLoading
          ? renderSkeletons()
          : visibleProducts.map((product) => (
              <div key={product.id} className="flex justify-center">
                <ProductCard product={product} />
              </div>
            ))}
      </div>
      {visibleCount < filteredProducts.length && (
        <div className="py-8 text-center">
          <CustomButton variant="primary" onClick={showMoreProducts}>
            {translate('showMore')}
          </CustomButton>
        </div>
      )}
    </div>
  );
}
