import type Identity from '@type/auth/identity.d.ts'

type RegisterResult = {
    user: { id: string, email: string }
    identity: Identity
}
export default RegisterResult