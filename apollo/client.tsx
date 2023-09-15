import { useMemo } from 'react'
import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { SchemaLink } from '@apollo/client/link/schema'
import { schema } from '../apollo/schema'
import merge from 'deepmerge'

let apolloClient

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((e) => {
      if (e.extensions.code === 'LOGIN_EXPIRED') {
        window.location.reload()
      }
    })
    return
  }

  if (networkError) console.log(`[Network error]: ${networkError}`)
})

function createIsomorphLink(context) {
  if (typeof window === 'undefined') {
    return new SchemaLink({ schema, context })
  } else {
    return new HttpLink({
      uri: '/api/graphql',
      credentials: 'same-origin',
    })
  }
}

function createApolloClient(context) {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: from([errorLink, createIsomorphLink(context)]),
    cache: new InMemoryCache(),
    queryDeduplication: false,
    defaultOptions: {
      mutate: { errorPolicy: 'all' },
    },
  })
}

export function initializeApollo(initialState = null, context = {}) {
  const _apolloClient = apolloClient ?? createApolloClient(context)

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache)

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState])
  return store
}
