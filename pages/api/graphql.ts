import { ApolloServer } from '@apollo/server'
import { NextRequest, NextResponse } from 'next/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'

import { schema } from '../../apollo/schema'

const authMiddleware = () => ({
  requestDidStart: () => ({
    didEncounterErrors: (requestContext) => {
      const {
        errors,
        contextValue: { res },
      } = requestContext

      errors.forEach((error) => {
        if (error.extensions.code === 'LOGIN_EXPIRED') {
          res.setHeader('set-cookie', `jwtToken=; path=/; httponly; Max-Age=0;`)
        }
      })
    },
  }),
})

export type Context = {
  request: NextRequest
  response: NextResponse
}

const apolloServer = new ApolloServer<Context>({
  schema,
  plugins: [ApolloServerPluginLandingPageLocalDefault({ includeCookies: true }), authMiddleware()],
})

export default startServerAndCreateNextHandler<Context>(apolloServer, {
  context: async (req, res) => {
    return { req, res }
  },
})
