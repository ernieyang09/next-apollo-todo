import gql from 'graphql-tag'
import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`

export default function LoginDialog({ open, setOpen }) {
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, { client }] = useMutation(LOGIN_MUTATION)

  useEffect(()=> {
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
              const r = await login({ variables: { username, password } })
              if (r.data?.login) {
                client.refetchQueries({ include: ['QueryMe'] })
              }
              setLoading(false)
              setOpen(false)
            }}>
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
