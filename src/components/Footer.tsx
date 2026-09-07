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
  const translate = useTranslations('Footer');
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
            <li className="title">{translate('mainMenu')}</li>
            <li className="text-body-1 hover:text-wearit-blue hover:cursor-pointer">
              {translate('shop')}
            </li>
            <li className="text-body-1 hover:text-wearit-blue hover:cursor-pointer">
              {translate('newReleases')}
            </li>
            <li className="text-body-1 hover:text-wearit-blue hover:cursor-pointer">
              {translate('accessories')}
            </li>
            <li className="text-body-1 hover:text-wearit-blue hover:cursor-pointer">
              {translate('giftCards')}
            </li>
            <li className="text-body-1 hover:text-wearit-blue hover:cursor-pointer">
              {translate('lastChanceSale')}
            </li>
          </ul>
        </div>
        <div className="text-wearit-white ">
          <ul className="flex flex-col gap-4">
            <li className="title">{translate('help')}</li>
            <li className="text-body-1 hover:text-wearit-blue hover:cursor-pointer">
              {translate('ordersShipping')}
            </li>
            <li className="text-body-1 hover:text-wearit-blue hover:cursor-pointer">
              {translate('returnsRefunds')}
            </li>
            <li className="text-body-1 hover:text-wearit-blue hover:cursor-pointer">
              {translate('salesTerms')}
            </li>
            <li className="text-body-1 hover:text-wearit-blue hover:cursor-pointer">
              {translate('privacyPolicy')}
            </li>
            <li className="text-body-1 hover:text-wearit-blue hover:cursor-pointer">
              {translate('termsOfService')}
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-2 max-w-[250px] lg:max-w-[320px] mt-8">
          <p className="text-wearit-white">{translate('newsletterText')}</p>
          <TextField
            label={translate('namePlaceholder')}
            variant="outlined"
            color="secondary"
            className="bg-wearit-white opacity-90 rounded-md"
          />
          <TextField
            label={translate('emailPlaceholder')}
            variant="outlined"
            color="secondary"
            className="bg-wearit-white opacity-90 rounded-md"
          />
          <CustomButton variant="primary" onClick={handleSubscribe}>
            {translate('subscribe')}
          </CustomButton>
          <div className="h-2"></div>
          <p
            className={`text-body-1 text-wearit-green ${
              !subscribeMessage && 'invisible'
            }`}
          >
            {translate('confirmationEmail')}
          </p>
        </div>
      </div>
      <div className="bg-wearit-yellow text-wearit-black text-center text-caption py-1">
        {translate('credit')}
        <br />
        <span className="text-wearit-black/70">
          v{appVersion.build} &middot; {appVersion.sha}
        </span>
      </div>
    </ThemeProvider>
  );
}
