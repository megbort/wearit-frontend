import { gql } from '@apollo/client';

// Login mutation
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        firstName
        lastName
        email
        cart {
          productId
          size
          color
          quantity
        }
      }
    }
  }
`;

// Get current user query
export const GET_ME_QUERY = gql`
  query GetMe {
    me {
      id
      firstName
      lastName
      email
      cart {
        productId
        size
        color
        quantity
      }
    }
  }
`;

// Exchange the httpOnly refresh cookie for a new access token
export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken {
    refreshToken {
      token
      user {
        id
        firstName
        lastName
        email
        cart {
          productId
          size
          color
          quantity
        }
      }
    }
  }
`;

// Revoke the refresh token and clear the cookie
export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

// Register mutation
export const REGISTER_MUTATION = gql`
  mutation Register(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
  ) {
    register(
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
    ) {
      token
      user {
        id
        firstName
        lastName
        email
        cart {
          productId
          size
          color
          quantity
        }
      }
    }
  }
`;
