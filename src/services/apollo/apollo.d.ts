import '@apollo/client';

// Apollo Client 4 requires errorPolicy defaults (set in ./client.ts) to be
// declared at the type level before they can be passed to `defaultOptions`.
declare module '@apollo/client' {
  namespace ApolloClient {
    namespace DeclareDefaultOptions {
      interface WatchQuery {
        errorPolicy: 'ignore';
      }
      interface Query {
        errorPolicy: 'all';
      }
    }
  }

  // Declaring defaultOptions opts into Apollo's "modern" signatures, which
  // disallow explicit generics (e.g. `client.query<ProductsResponse>()`).
  // Keep the classic signatures until hooks move to TypedDocumentNode.
  interface TypeOverrides {
    signatureStyle: 'classic';
  }
}
