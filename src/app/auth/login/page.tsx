'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { ThemeProvider } from '@emotion/react';
import theme from '../../../theme/theme';
import Link from 'next/link';
import { useLogin } from '../../../hooks/useAuth';
import useStore from '../../../services/store/useStore';
import { useTranslations } from 'next-intl';

const LoginPage = () => {
  const translate = useTranslations('LoginPage');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const router = useRouter();
  const { login, loading } = useLogin();
  const { setNotification } = useStore();

  const handleLogin = async () => {
    if (!email || !password) {
      setLocalError(translate('errorRequired'));
      return;
    }

    try {
      setLocalError('');
      await login(email, password);
      setNotification({ message: translate('successMessage'), severity: 'success' });
      router.push('/');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : translate('errorFallback');
      setLocalError(message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="h-full flex flex-col py-24 m-auto gap-4 max-w-[275px] md:max-w-[550px] dark:text-wearit-white">
        <h3 className="text-center">{translate('heading')}</h3>
        <p className="text-center">{translate('subheading')}</p>
        <TextField
          label={translate('email')}
          variant="outlined"
          color="secondary"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-wearit-white opacity-90 rounded-md"
        />
        <TextField
          label={translate('password')}
          variant="outlined"
          color="secondary"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-wearit-white opacity-90 rounded-md"
        />
        <Button
          variant="contained"
          onClick={handleLogin}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{
            fontFamily: `'Comfortaa', sans-serif`,
            backgroundColor: '#ff3d5c',
            color: '#fff',
            textTransform: 'none',
            '&:hover': { backgroundColor: '#76dbbf' },
            '&.Mui-disabled': { opacity: 0.7, backgroundColor: '#ff3d5c', color: '#fff' },
          }}
        >
          {loading ? translate('loggingIn') : translate('loginButton')}
        </Button>
        {localError && <p className="text-red-500 text-sm">{localError}</p>}
        <div>
          <p>
            {translate('noAccount')}&nbsp;
            <Link href={'signup'} className="text-wearit-green">
              {translate('signUp')}
            </Link>
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default LoginPage;
