import gql from 'graphql-tag'
import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import {
  Button,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`

export default function LoginDialog({ open, setOpen }) {
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const [login, { client }] = useMutation(LOGIN_MUTATION)

  useEffect(() => {
    if (!open) {
      setUsername('')
      setPassword('')
    }
  }, [open])

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false)
        }}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            Use below username // password
            <ul>
              <li>example01 // example01</li>
              <li>example02 // example02</li>
              <li>example03 // example03</li>
            </ul>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            fullWidth
            variant="standard"
            value={username}
            onChange={({ target: { value } }) => {
              setUsername(value)
            }}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={password}
            onChange={({ target: { value } }) => {
              setPassword(value)
            }}
          />
          <Typography height={24} color="error">{error}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={loading}
            onClick={() => {
              setOpen(false)
            }}>
            Cancel
          </Button>
          <Button
            disabled={loading}
            onClick={async () => {
              setLoading(true)
              setError('')
              const r = await login({ variables: { username, password } })
              if (r.data?.login) {
                client.refetchQueries({ include: ['QueryMe'] })
                setOpen(false)
              } else {
                setError('Login fail')
              }
              setLoading(false)
            }}>
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
