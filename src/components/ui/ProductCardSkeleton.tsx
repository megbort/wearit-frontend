'use client';

import React from 'react';

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="relative w-[280px] h-[280px] flex flex-col justify-between bg-neutral-100 dark:bg-zinc-800 rounded-lg border dark:border-zinc-600 animate-pulse">
      <div className="h-[230px] bg-neutral-300 dark:bg-zinc-600 rounded-t-lg"></div>
      <div className="h-[70px] p-2 flex flex-col justify-center items-center gap-2">
        <div className="h-4 bg-neutral-300 dark:bg-zinc-600 rounded-sm w-3/4"></div>
        <div className="flex gap-2 justify-center">
          <div className="h-4 bg-neutral-300 dark:bg-zinc-600 rounded-sm w-16"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
