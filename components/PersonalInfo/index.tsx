import gql from 'graphql-tag'
import { Grid, Typography } from '@mui/material'
import { useMutation } from '@apollo/client'
import useMe from '../../hooks/useMe'
import { useLoadingFormContext } from '../../context/loginFormContext'

const LOGOUT_MUTATION = gql`
  mutation logout {
    logout
  }
`

const Login = () => {
  const { setOpen } = useLoadingFormContext()
  return (
    <Typography
      sx={{ cursor: 'pointer' }}
      color="primary"
      onClick={() => {
        setOpen(true)
      }}>
      login
    </Typography>
  )
}

const Logout = ({ username }) => {
  const [logout] = useMutation(LOGOUT_MUTATION, {
    refetchQueries: ['QueryMe'],
  })

  return (
    <>
      {`Hello ${username}`}{' '}
      <Typography
        color="primary"
        sx={{ ml: '4px', cursor: 'pointer' }}
        component="span"
        onClick={() => {
          logout()
        }}>
        Log out
      </Typography>
    </>
  )
}

const PersonalInfo = () => {
  const me = useMe()

  return (
    <Grid container alignItems="center" justifyContent="flex-end" mb="16px">
      {me ? <Logout username={me.username} /> : <Login />}
    </Grid>
  )
}

export default PersonalInfo
