import type Identity from '@type/auth/identity.d.ts'
export type RegisterResult = {
    user: { id: string, email: string }
    identity: Identity
}
export type LoginResult = {
    id: string
    identity: Identity
}