import type { Preview } from '@storybook/nextjs-vite';
import GlobalStyles from '@mui/material/GlobalStyles';
import { StyledEngineProvider } from '@mui/material/styles';
import { NextIntlClientProvider } from 'next-intl';
import React from 'react';
import '../src/app/globals.css';
import messages from '../messages/en.json';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <StyledEngineProvider enableCssLayer>
        <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
        <NextIntlClientProvider locale="en" messages={messages}>
          <Story />
        </NextIntlClientProvider>
      </StyledEngineProvider>
    ),
  ],
};

export default preview;
