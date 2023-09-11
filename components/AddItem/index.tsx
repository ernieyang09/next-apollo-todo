import gql from 'graphql-tag'
import { useState } from 'react'
import { useMutation } from 'react-apollo'
import { InputBase, Divider, Button, Paper } from '@mui/material'

import useMe from '../../hooks/useMe'
import { useLoadingFormContext } from '../../context/loginFormContext'

const ADD_TODO = gql`
  mutation CreateTodo($title: String!) {
    createTodo(title: $title)
  }
`

const AddItem = () => {
  const [value, setValue] = useState('')
  const me = useMe()
  const { setOpen } = useLoadingFormContext()
  const [addTodo, { loading }] = useMutation(ADD_TODO, {
    refetchQueries: ['QueryMe'],
    awaitRefetchQueries: true,
    onCompleted() {
      setValue('')
    },
    // onError,
  })

  return (
    <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}>
      <InputBase
        disabled={loading}
        sx={{ ml: 1, flex: 1 }}
        placeholder="Add TODO"
        inputProps={{ 'aria-label': 'Add TODO' }}
        value={value}
        onChange={({ target: { value: v } }) => {
          setValue(v)
        }}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <Button
        disabled={!value || loading}
        onClick={
          me
            ? () => {
                addTodo({ variables: { title: value } })
              }
            : () => {
                setOpen(true)
              }
        }>
        Add
      </Button>
    </Paper>
  )
}

export default AddItem
