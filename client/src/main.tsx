import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { Provider } from 'react-redux'
import store from '@store/store'
import App from './App'

const client = new ApolloClient({
    link: new HttpLink({
        uri: `http://${import.meta.env['VITE_DOMAIN']}:${import.meta.env['VITE_SERVER_PORT']}/gql`,
        credentials: 'include'
    }),
    cache: new InMemoryCache()
})
createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <Provider store={store}>
                <App />
            </Provider>
        </ApolloProvider>
    </BrowserRouter>
)