import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HttpLink, ApolloLink, ApolloClient, InMemoryCache, Observable } from '@apollo/client'
import { ErrorLink } from '@apollo/client/link/error'
import { CombinedGraphQLErrors } from '@apollo/client/errors'
import { ApolloProvider } from '@apollo/client/react'
import { Provider } from 'react-redux'
import { setAccessToken, setUser } from '@store/slices/core/app'
import store from '@store/store'
import axios from 'axios'
import App from './App'

const httpLinkOmit = new HttpLink({
    uri: `http://${import.meta.env['VITE_DOMAIN']}:${import.meta.env['VITE_SERVER_PORT']}/gql`,
    credentials: 'omit'
})
const httpLinkInclude = new HttpLink({
    uri: `http://${import.meta.env['VITE_DOMAIN']}:${import.meta.env['VITE_SERVER_PORT']}/gql`,
    credentials: 'include'
})
const splitLink = ApolloLink.split(
    operation => operation.operationName === 'Register' || operation.operationName == 'Login',
    httpLinkInclude,
    httpLinkOmit
)
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
    if (!(CombinedGraphQLErrors.is(error) && error.errors.find(e => e.extensions?.['code'] === 'TOKEN_EXPIRED'))) return new Observable(observer => {
        (async () => {
            try {
                const res = await axios.post(
                    `http://${import.meta.env['VITE_DOMAIN']}:${import.meta.env['VITE_SERVER_PORT']}/auth`,
                    {
                        identity: {
                            tz: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
                            screenRes: `${window.screen.width}x${window.screen.height}`,
                            colorDepth: String(window.screen.colorDepth),
                            devicePixelRatio: String(window.devicePixelRatio || 1),
                            touchSupport: ('ontouchstart' in window).toString(),
                            hardwareConcurrency: String(navigator.hardwareConcurrency || '')
                        }
                    },
                    { withCredentials: true }
                )
                const newAt = res.data
                store.dispatch(setAccessToken(newAt))
                const prev = operation.getContext()
                operation.setContext({
                    headers: {
                        ...prev['headers'],
                        Authorization: `Bearer ${newAt}`
                    }
                })
                forward(operation).subscribe({
                    next: v => observer.next(v),
                    error: e => observer.error(e),
                    complete: () => observer.complete()
                })
            } catch {
                store.dispatch(setAccessToken(null))
                store.dispatch(setUser(null))
                observer.complete()
            }
        })()
    })
    return
})
const client = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, splitLink]),
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