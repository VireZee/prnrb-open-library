import { gql } from '@apollo/client'
export default gql`
    mutation Login($emailOrUsername: String!, $pass: String!, $identity: Identity!) {
        login(emailOrUsername: $emailOrUsername, pass: $pass, identity: $identity)
    }
`