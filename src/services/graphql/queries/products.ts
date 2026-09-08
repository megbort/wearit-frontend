import { gql } from '@apollo/client';

export const GET_PRODUCTS_QUERY = gql`
  query GetProducts {
    products {
      id
      sku
      name
      price
      images
      colors
      sizes
      details
      featured
      sale
      discountPercent
      effectivePrice
      category
    }
  }
`;

export const GET_PRODUCT_QUERY = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      sku
      name
      price
      images
      colors
      sizes
      details
      featured
      sale
      discountPercent
      effectivePrice
      category
    }
  }
`;

export const GET_FEATURED_PRODUCTS_QUERY = gql`
  query GetFeaturedProducts {
    featuredProducts {
      id
      sku
      name
      price
      images
      sale
      discountPercent
      effectivePrice
      category
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY_QUERY = gql`
  query GetProductsByCategory($category: String!) {
    productsByCategory(category: $category) {
      id
      sku
      name
      price
      images
      colors
      sizes
      details
      featured
      sale
      discountPercent
      effectivePrice
      category
    }
  }
`;
