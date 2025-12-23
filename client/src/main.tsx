import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HttpLink, ApolloLink, ApolloClient, InMemoryCache } from '@apollo/client'
import { ErrorLink } from '@apollo/client/link/error'
import { ApolloProvider } from '@apollo/client/react'
import { Provider } from 'react-redux'
import store from '@store/store'
import App from './App'

const httpLink = new HttpLink({
    uri: `http://${import.meta.env['VITE_DOMAIN']}:${import.meta.env['VITE_SERVER_PORT']}/gql`,
    credentials: 'include'
})
const authLink = new ApolloLink((operation, forward) => {
    const at = store.getState().app.accessToken
    if (at) {
        operation.setContext(({ headers = {} }) => ({
            headers: {
                ...headers,
                Authorization: `Bearer ${at}`
            }
        }))
    }
    return forward(operation)
})
const errorLink = new ErrorLink(({ error, operation, forward }) => {

})
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