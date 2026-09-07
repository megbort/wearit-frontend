'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { ThemeProvider } from '@emotion/react';
import theme from '../../../theme/theme';
import Link from 'next/link';
import { useRegister } from '../../../hooks/useAuth';
import useStore from '../../../services/store/useStore';
import { useTranslations } from 'next-intl';

const SignUpPage = () => {
  const translate = useTranslations('SignUpPage');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { register, loading } = useRegister();
  const router = useRouter();
  const { setNotification } = useStore();

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !password) {
      setLocalError(translate('errorRequired'));
      return;
    }

    try {
      setLocalError('');
      await register(firstName, lastName, email, password);
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
          label={translate('firstName')}
          variant="outlined"
          color="secondary"
          className="bg-wearit-white opacity-90 rounded-md"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          label={translate('lastName')}
          variant="outlined"
          color="secondary"
          className="bg-wearit-white opacity-90 rounded-md"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          label={translate('email')}
          variant="outlined"
          color="secondary"
          className="bg-wearit-white opacity-90 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label={translate('password')}
          type="password"
          variant="outlined"
          color="secondary"
          className="bg-wearit-white opacity-90 rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
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
          {loading ? translate('creatingAccount') : translate('createAccount')}
        </Button>
        {localError && <p className="text-red-500 text-sm">{localError}</p>}
        <div>
          <p>
            {translate('haveAccount')}&nbsp;
            <Link href={'login'} className="text-wearit-green">
              {translate('login')}
            </Link>
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default SignUpPage;
