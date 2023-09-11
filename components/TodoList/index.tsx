import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import {
  Box,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Stack,
  Divider,
  Button,
} from '@mui/material'
import { Delete } from '@mui/icons-material'
import { useState } from 'react'

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: ID!, $status: String!) {
    updateTodo(id: $id, status: $status)
  }
`

const DELETE_TOD = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`

// this should use key instead of value
const statusToColor = (status) => ({ doing: 'warning', finished: 'success' })[status]

const TodoList = ({ todos, statusList }) => {
  const [loading, setLoading] = useState(false)
  const [updateTodo] = useMutation(UPDATE_TODO, {
    refetchQueries: ['QueryMe'],
    awaitRefetchQueries: true,
    onCompleted: () => {
      setLoading(false)
    },
  })
  const [deleteTodo] = useMutation(DELETE_TOD, {
    refetchQueries: ['QueryMe'],
    awaitRefetchQueries: true,
    onCompleted: () => {
      setLoading(false)
    },
  })

  return (
    <List>
      {!todos.length && (
        <Grid container my="16px" justifyContent="center">
          <Typography variant="h6">No Todo find</Typography>
        </Grid>
      )}
      {todos.map((t) => (
        <ListItem key={t.id}>
          <Grid container alignItems="center">
            <Box sx={{ width: '75px', fontSize: '14px' }}>
              <Chip label={t.tag} size="small" variant="outlined" color={statusToColor(t.tag)} />
            </Box>
            <Typography variant="h6">{t.title}</Typography>
          </Grid>

          <ListItemSecondaryAction sx={{ background: 'white' }}>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={2}>
              {statusList.map((st) => {
                if (t.tag === st.key) {
                  return null
                }
                return (
                  <Button
                    key={st.key}
                    sx={{
                      width: '70px',
                    }}
                    disabled={loading}
                    size="small"
                    color={statusToColor(st.key)}
                    onClick={() => {
                      setLoading(true)
                      updateTodo({
                        variables: {
                          id: t.id,
                          status: st.key,
                        },
                      })
                    }}>
                    {st.value}
                  </Button>
                )
              })}

              <IconButton
                size="small"
                disabled={loading}
                onClick={() => {
                  setLoading(true)
                  deleteTodo({
                    variables: {
                      id: t.id,
                    },
                  })
                }}>
                <Delete fontSize="small" />
              </IconButton>
            </Stack>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  )
}

export default TodoList
