import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import ProductCard from '../../components/ui/ProductCard';
import { Products } from '@/services/mocks/products.mock';

const meta: Meta<typeof ProductCard> = {
  title: 'Components/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    product: Products[0],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(Products[0].name)).toBeInTheDocument();
    await expect(
      canvas.getByText(new RegExp(Products[0].price.toString())),
    ).toBeInTheDocument();
  },
};

const saleProduct = Products.find((p) => p.sale && (p.discountPercent ?? 0) > 0)!;

export const OnSale: Story = {
  args: {
    product: saleProduct,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText(`$${saleProduct.price}`),
    ).toBeInTheDocument();
    await expect(
      canvas.getByText(`$${saleProduct.effectivePrice!.toFixed(2)}`),
    ).toBeInTheDocument();
  },
};
