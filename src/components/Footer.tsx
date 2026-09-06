'use client';
import {
  faXTwitter,
  faInstagram,
  faTiktok,
  faFacebook,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import CustomButton from './ui/Button';
import TextField from '@mui/material/TextField';
import { ThemeProvider } from '@emotion/react';
import theme from '../theme/theme';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { appVersion } from '@/utils/version';

export default function Footer() {
  const t = useTranslations('Footer');
  const [subscribeMessage, setSubscribeMessage] = useState<boolean>(false);

  const handleSubscribe = () => {
    setSubscribeMessage(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="flex p-8 md:p-4 gap-8 flex-col text-center md:text-left md:flex-row justify-around items-center md:h-[500px] bg-wearit-black">
        <div className="text-wearit-white gap-8">
          <Image
            src="wearit/wearit-logo-v2_xo1gea.png"
            alt="WearIt Logo"
            height={175}
            width={175}
            style={{ width: 'auto' }}
          />
          <div className="flex justify-center pt-2 gap-6">
            <FontAwesomeIcon
              icon={faXTwitter}
              style={{ fontSize: '22px' }}
              className="text-wearit-white hover:text-wearit-blue hover:cursor-pointer"
            />
            <FontAwesomeIcon
              icon={faInstagram}
              style={{ fontSize: '22px' }}
              className="text-wearit-white hover:text-wearit-blue hover:cursor-pointer"
            />
            <FontAwesomeIcon
              icon={faTiktok}
              style={{ fontSize: '22px' }}
              className="text-wearit-white hover:text-wearit-blue hover:cursor-pointer"
            />
            <FontAwesomeIcon
              icon={faFacebook}
              style={{ fontSize: '22px' }}
              className="text-wearit-white hover:text-wearit-blue hover:cursor-pointer"
            />
          </div>
        </div>
        <div className="text-wearit-white">
          <ul className="flex flex-col gap-4">
            <li className="title">{t('mainMenu')}</li>
            <li className="text-body-1 hover:text-wearit-blue hover:cursor-pointer">
              {t('shop')}
            </li>
            <li className="text-body-1 hover:text-wearit-blue hover:cursor-pointer">
              {t('newReleases')}
            </li>
            <li className="text-body-1 hover:text-wearit-blue hover:cursor-pointer">
              {t('accessories')}
            </li>
            <li className="text-body-1 hover:text-wearit-blue hover:cursor-pointer">
              {t('giftCards')}
            </li>
            <li className="text-body-1 hover:text-wearit-blue hover:cursor-pointer">
              {t('lastChanceSale')}
            </li>
          </ul>
        </div>
        <div className="text-wearit-white ">
          <ul className="flex flex-col gap-4">
            <li className="title">{t('help')}</li>
            <li className="text-body-1 hover:text-wearit-blue hover:cursor-pointer">
              {t('ordersShipping')}
            </li>
            <li className="text-body-1 hover:text-wearit-blue hover:cursor-pointer">
              {t('returnsRefunds')}
            </li>
            <li className="text-body-1 hover:text-wearit-blue hover:cursor-pointer">
              {t('salesTerms')}
            </li>
            <li className="text-body-1 hover:text-wearit-blue hover:cursor-pointer">
              {t('privacyPolicy')}
            </li>
            <li className="text-body-1 hover:text-wearit-blue hover:cursor-pointer">
              {t('termsOfService')}
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-2 max-w-[250px] lg:max-w-[320px] mt-8">
          <p className="text-wearit-white">{t('newsletterText')}</p>
          <TextField
            label={t('namePlaceholder')}
            variant="outlined"
            color="secondary"
            className="bg-wearit-white opacity-90 rounded-md"
          />
          <TextField
            label={t('emailPlaceholder')}
            variant="outlined"
            color="secondary"
            className="bg-wearit-white opacity-90 rounded-md"
          />
          <CustomButton variant="primary" onClick={handleSubscribe}>
            {t('subscribe')}
          </CustomButton>
          <div className="h-2"></div>
          <p
            className={`text-body-1 text-wearit-green ${
              !subscribeMessage && 'invisible'
            }`}
          >
            {t('confirmationEmail')}
          </p>
        </div>
      </div>
      <div className="bg-wearit-yellow text-wearit-black text-center text-caption py-1">
        {t('credit')}
        <br />
        <span className="text-wearit-black/70">
          v{appVersion.build} &middot; {appVersion.sha}
        </span>
      </div>
    </ThemeProvider>
  );
}
