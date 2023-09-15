import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'

const ME_QUERY = gql`
  query {
    me {
      username
    }
  }
`

const useMe = () => {
  const { data } = useQuery(ME_QUERY)
  return data.me
}

export default useMe
