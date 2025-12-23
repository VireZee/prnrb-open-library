import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { GlobalUserState } from '@type/redux/state'
import type User from '@type/redux/auth/user'

const initialState: GlobalUserState = {
    accessToken: null,
    user: undefined,
    verified: null,
    search: ''
}
const app = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAccessToken: (state, { payload }: PayloadAction<string | null>) => {
            state['accessToken'] = payload
        },
        setUser: (state, { payload }: PayloadAction<null | User>) => {
            state['user'] = payload
        },
        setVerified: (state, { payload }: PayloadAction<boolean>) => {
            state['verified'] = payload
        },
        setSearch: (state, { payload }: PayloadAction<string>) => {
            state['search'] = payload
        }
    }
})
export const { setAccessToken, setUser, setVerified, setSearch } = app.actions
export default app.reducer