import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within } from 'storybook/test';
import CartLineItem from '../../components/ui/CartLineItem';
import type { CartItem } from '@/services/models/cart';
import { Products } from '@/services/mocks/products.mock';

const itemMock: CartItem = {
  productId: Products[0].id,
  size: 'm',
  color: 'black',
  quantity: 2,
  product: {
    name: Products[0].name,
    price: Products[0].price,
    effectivePrice: Products[0].price,
    image: Products[0].images[0],
  },
};

const saleItemMock: CartItem = {
  productId: Products[0].id,
  size: 'm',
  color: 'black',
  quantity: 2,
  product: {
    name: Products[0].name,
    price: Products[0].price,
    effectivePrice: Products[0].price - 5,
    image: Products[0].images[0],
  },
};

const meta: Meta<typeof CartLineItem> = {
  title: 'Components/CartLineItem',
  component: CartLineItem,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    item: itemMock,
    onIncrement: fn(),
    onDecrement: fn(),
    onRemove: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(itemMock.product.name)).toBeInTheDocument();
    await expect(canvas.getByText('Black | M')).toBeInTheDocument();
    await expect(
      canvas.getByText(
        `$${(itemMock.product.effectivePrice * itemMock.quantity).toFixed(2)}`,
      ),
    ).toBeInTheDocument();
    await expect(canvas.getByText('2')).toBeInTheDocument();

    await expect(
      canvas.getByRole('img', { name: itemMock.product.name }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole('button', { name: 'Decrease quantity' }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole('button', { name: 'Increase quantity' }),
    ).toBeInTheDocument();
  },
};

export const OnSale: Story = {
  args: {
    item: saleItemMock,
    onIncrement: fn(),
    onDecrement: fn(),
    onRemove: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByText(
        `$${(saleItemMock.product.price * saleItemMock.quantity).toFixed(2)}`,
      ),
    ).toBeInTheDocument();
    await expect(
      canvas.getByText(
        `$${(saleItemMock.product.effectivePrice * saleItemMock.quantity).toFixed(2)}`,
      ),
    ).toBeInTheDocument();
  },
};
