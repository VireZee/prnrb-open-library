import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { GlobalUserState } from '@type/redux/state'

const initialState: GlobalUserState = {
    emailOrUsername: '',
    pass: '',
    show: false,
    error: ''
}
const login = createSlice({
    name: 'login',
    initialState,
    reducers: {
        change: (state, { payload: { name, value } }: PayloadAction<{ name: keyof GlobalUserState, value: string }>) => {
            state[name] = value
        },
        setShow: (state, { payload }: PayloadAction<boolean>) => {
            state['show'] = payload
        },
        setError: (state, { payload }: PayloadAction<string>) => {
            state['error'] = payload
        }
    }
})
export const { change, setShow, setError } = login.actions
export default login.reducer