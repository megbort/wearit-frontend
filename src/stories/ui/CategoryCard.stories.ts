import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import CategoryCard from '../../components/ui/CategoryCard';
import { CategoryMock } from '@/services/mocks/category.mock';

const meta: Meta<typeof CategoryCard> = {
  title: 'Components/CategoryCard',
  component: CategoryCard,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    category: CategoryMock,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Shop New Arrivals')).toBeInTheDocument();

    const link = canvas.getByRole('link');
    await expect(link).toHaveAttribute('href', '/products');
  },
};
