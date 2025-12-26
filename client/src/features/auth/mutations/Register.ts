import { gql } from '@apollo/client'
export default gql`
    mutation Register($name: String!, $username: String!, $email: String!, $pass: String!, $rePass: String, $show: Boolean! $identity: Identity!) {
        register(name: $name, username: $username, email: $email, pass: $pass, rePass: $rePass, show: $show, identity: $identity)
    }
`