'use client';

import Image from 'next/image';
import CustomButton from '../components/ui/Button';
import Featured from '@/components/Featured';
import Category from '@/components/Categories';
import { useTranslations } from 'next-intl';

export default function Home() {
  const translate = useTranslations('HomePage');

  return (
    <>
      <div className="relative h-[calc(100vh-140px)] overflow-hidden">
        <Image
          src="wearit/wearit-hero-v2_fdxe1s.jpg"
          alt={translate('heroAlt')}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute top-10 left-1/2 md:top-1/4 md:left-3/4 transform -translate-x-1/2 translate-y-1/2 bg-stone-900/80 p-8 rounded w-[300px] md:w-[400px]">
          <h3 className="text-wearit-white">{translate('appTitle')}</h3>
          <p className="subtitle-1 text-wearit-white py-4">{translate('appSubtitle')}</p>
          <CustomButton variant="primary">{translate('downloadNow')}</CustomButton>
        </div>
      </div>
      <Featured></Featured>
      <Category></Category>
    </>
  );
}
