'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faCartShopping,
  faBars,
  faTimes,
  faSun,
  faMoon,
} from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@/components/ThemeProvider';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Badge from '@mui/material/Badge';
import theme from '../theme/theme';
import { ThemeProvider } from '@emotion/react';
import CartDrawer from './CartDrawer';
import useStore from '../services/store/useStore';
import { useLogout } from '../hooks/useAuth';
import { useTranslations } from 'next-intl';

export default function Navbar() {
  const t = useTranslations('Navbar');

  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [accountMenuAnchor, setAccountMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const open = Boolean(mobileMenuAnchor);
  const userMenuOpen = Boolean(accountMenuAnchor);

  const user = useStore((state) => state.user);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const isLoading = useStore((state) => state.isLoading);
  const setNotification = useStore((state) => state.setNotification);
  const cartCount = useStore((state) =>
    state.cart.reduce((sum, item) => sum + item.quantity, 0)
  );
  const { logout } = useLogout();

  const { resolvedTheme, setTheme } = useTheme();
  const handleThemeToggle = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAccountMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setMobileMenuAnchor(null);
    setAccountMenuAnchor(null);
  };

  const handleCartOpen = () => {
    setIsCartOpen(true);
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    setNotification({ message: t('logoutMessage'), severity: 'info' });
  };

  return (
    <ThemeProvider theme={theme}>
      <header className="w-full">
        <div className="bg-wearit-yellow flex justify-center py-1 text-caption">
          <p>{t('banner')}</p>
        </div>
        <nav className="bg-wearit-black flex items-center justify-between p-4 md:p-8 h-[100px]">
          <div>
            <Link href={'/'}>
              <Image
                src="wearit/wearit-logo-v3_cj1le4.png"
                alt={t('logoAlt')}
                width={200}
                height={50}
                priority
                style={{ height: 'auto' }}
              />
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center gap-2">
            <Button onClick={handleThemeToggle} aria-label="Toggle theme">
              <FontAwesomeIcon
                icon={resolvedTheme === 'dark' ? faSun : faMoon}
                style={{ fontSize: '20px' }}
                className="text-wearit-red hover:text-wearit-green"
              />
            </Button>
            <Button onClick={handleCartOpen} aria-label="Open cart">
              <Badge
                badgeContent={cartCount}
                sx={{ '& .MuiBadge-badge': { backgroundColor: '#0070f3', color: '#fff' } }}
              >
                <FontAwesomeIcon
                  icon={faCartShopping}
                  style={{ fontSize: '20px' }}
                  className="text-wearit-red hover:text-wearit-green"
                />
              </Badge>
            </Button>
            <Button
              id="menu-button"
              aria-controls={open ? 'menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <FontAwesomeIcon
                icon={open ? faTimes : faBars}
                className="text-wearit-red hover:text-wearit-green"
                style={{ fontSize: '24px' }}
              />
            </Button>
            <Menu
              id="menu"
              anchorEl={mobileMenuAnchor}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'menu-button',
              }}
              slotProps={{
                paper: {
                  className: 'bg-wearit-white w-[200px]',
                },
              }}
            >
              <MenuItem onClick={handleClose}>
                <Link href={'/products'} className="w-full">
                  {t('newArrivals')}
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href={'/products'} className="w-full">
                  {t('apparel')}
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href={'/products'} className="w-full">
                  {t('accessories')}
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href={'/products'} className="w-full">
                  {t('onSale')}
                </Link>
              </MenuItem>
            </Menu>
          </div>

          {/* Web Menu */}
          <div className="hidden lg:flex gap-4 lg:gap-8 xl:gap-20 flex-grow justify-center items-center">
            <Link
              href={'/products'}
              className="title text-wearit-red hover:text-wearit-green"
            >
              {t('newArrivals')}
            </Link>
            <Link
              href={'/products'}
              className="title text-wearit-red hover:text-wearit-green"
            >
              {t('apparel')}
            </Link>
            <Link
              href={'/products'}
              className="title text-wearit-red hover:text-wearit-green"
            >
              {t('accessories')}
            </Link>
            <Link
              href={'/products'}
              className="title text-wearit-red hover:text-wearit-green"
            >
              {t('onSale')}
            </Link>
          </div>

          <div className="hidden lg:flex basis-[200px] justify-center items-center gap-6">
            <Button onClick={handleThemeToggle} aria-label="Toggle theme">
              <FontAwesomeIcon
                icon={resolvedTheme === 'dark' ? faSun : faMoon}
                style={{ fontSize: '20px' }}
                className="text-wearit-red hover:text-wearit-green"
              />
            </Button>
            <Button
              onClick={handleUserClick}
              aria-controls={userMenuOpen ? 'user-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={userMenuOpen ? 'true' : undefined}
            >
              <FontAwesomeIcon
                icon={faUser}
                style={{ fontSize: '22px' }}
                className="text-wearit-red hover:text-wearit-green hover:cursor-pointer"
              />
            </Button>
            <Menu
              id="user-menu"
              anchorEl={accountMenuAnchor}
              open={userMenuOpen}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              slotProps={{
                paper: {
                  className: 'bg-wearit-white w-[180px]',
                },
              }}
            >
              {isLoading
                ? [
                    <MenuItem key="loading" disabled className="justify-center">
                      <CircularProgress size={20} className="text-wearit-red" />
                    </MenuItem>,
                  ]
                : isAuthenticated && user
                ? [
                    <MenuItem key="user-info" disabled>
                      <div>
                        <div className="font-semibold text-sm">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-gray-600">
                          {user.email}
                        </div>
                      </div>
                    </MenuItem>,
                    <MenuItem key="logout" onClick={handleLogout}>
                      <span className="text-wearit-black">{t('logout')}</span>
                    </MenuItem>,
                  ]
                : [
                    <MenuItem key="login" onClick={handleClose}>
                      <Link href={'/auth/login'} className="w-full">
                        {t('login')}
                      </Link>
                    </MenuItem>,
                    <MenuItem key="signup" onClick={handleClose}>
                      <Link href={'/auth/signup'} className="w-full">
                        {t('signUp')}
                      </Link>
                    </MenuItem>,
                  ]}
            </Menu>
            <Badge
              badgeContent={cartCount}
              sx={{ '& .MuiBadge-badge': { backgroundColor: '#0070f3', color: '#fff' } }}
            >
              <FontAwesomeIcon
                icon={faCartShopping}
                style={{ fontSize: '22px' }}
                className="text-wearit-red hover:text-wearit-green hover:cursor-pointer"
                onClick={handleCartOpen}
              />
            </Badge>
          </div>
        </nav>

        {/* Cart Drawer */}
        <CartDrawer open={isCartOpen} onClose={handleCartClose} />
      </header>
    </ThemeProvider>
  );
}
