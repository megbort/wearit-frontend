import { gql } from '@apollo/client';

export const ADD_TO_CART_MUTATION = gql`
  mutation AddToCart($productId: ID!, $size: String!, $color: String!, $quantity: Int) {
    addToCart(productId: $productId, size: $size, color: $color, quantity: $quantity) {
      productId
      size
      color
      quantity
    }
  }
`;

export const UPDATE_CART_ITEM_MUTATION = gql`
  mutation UpdateCartItem($productId: ID!, $size: String!, $color: String!, $quantity: Int!) {
    updateCartItem(productId: $productId, size: $size, color: $color, quantity: $quantity) {
      productId
      size
      color
      quantity
    }
  }
`;

export const REMOVE_FROM_CART_MUTATION = gql`
  mutation RemoveFromCart($productId: ID!, $size: String!, $color: String!) {
    removeFromCart(productId: $productId, size: $size, color: $color) {
      productId
      size
      color
      quantity
    }
  }
`;

export const CLEAR_CART_MUTATION = gql`
  mutation ClearCart {
    clearCart
  }
`;
