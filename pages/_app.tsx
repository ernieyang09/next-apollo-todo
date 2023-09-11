import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { ApolloProvider } from 'react-apollo'
import { useApollo } from '../apollo/client'
import LoadingFormProvider from '../context/loginFormContext'

export default function App({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState)

  return (
    <ApolloProvider client={apolloClient}>
      <LoadingFormProvider>
        <Component {...pageProps} />
      </LoadingFormProvider>
    </ApolloProvider>
  )
}
