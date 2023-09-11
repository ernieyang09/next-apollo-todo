import gql from 'graphql-tag'
import { initializeApollo } from '../apollo/client'
import { Box, Grid, Alert, AlertTitle, Paper } from '@mui/material'

import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { useQuery } from 'react-apollo'
import { useState } from 'react'
import AddItem from '../components/AddItem'
import TodoList from '../components/TodoList'
import PersonalInfo from '../components/PersonalInfo'

const ViewerQuery = gql`
  query QueryMe {
    me {
      id
      username
      todos {
        id
        title
        tag
      }
    }
  }
`

const QUERY_STATUSLIST = gql`
  query QueryStatusList {
    statusList {
      key
      value
    }
  }
`

const Main = () => {
  const { data: meData } = useQuery(ViewerQuery)

  const {
    data: { statusList },
  } = useQuery(QUERY_STATUSLIST)

  const [filter, setFilter] = useState(() => statusList.map((s) => s.key))

  const todos = (meData?.me?.todos || []).filter((t) => filter.includes(t.tag))

  const handleClick = (_, newFilter) => {
    setFilter(newFilter)
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
      <Grid container direction="row" justifyContent="flex-end">
        <PersonalInfo />
      </Grid>
      <Paper sx={{ p: '16px' }}>
        <Box>TODO List</Box>
        <Grid container direction="row" justifyContent="flex-end">
          <ToggleButtonGroup
            color="primary"
            value={filter}
            onChange={handleClick}
            aria-label="Platform">
            {statusList.map((s) => (
              <ToggleButton key={s.key} value={s.key}>
                {s.value}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Grid>
        <Box>
          <TodoList todos={todos} statusList={statusList} />
        </Box>
        <AddItem />
      </Paper>
      <Box mt="32px">
        <Alert severity="info">
          <AlertTitle>Info</AlertTitle>
          For api request, it might take 5 - 10 seconds. (Due to the headless cms update)
        </Alert>
      </Box>
    </Box>
  )
}

export const getServerSideProps = async (ctx) => {
  const apolloClient = initializeApollo(undefined, ctx)

  await Promise.all([
    apolloClient.query({
      query: ViewerQuery,
    }),
    apolloClient.query({
      query: QUERY_STATUSLIST,
    }),
  ])

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  }
}

export default Main
