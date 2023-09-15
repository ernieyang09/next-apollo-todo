import {
  ApolloServer,
  ApolloServerPlugin,
  GraphQLRequestContext,
  GraphQLRequestListener,
} from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { schema } from '../../apollo/schema'

export class LoggingPlugin implements ApolloServerPlugin {
  // Fires whenever a GraphQL request is received from a client.
  async requestDidStart(
    requestContext: GraphQLRequestContext<any>,
  ): Promise<GraphQLRequestListener<any>> {
    return {
      async willSendResponse() {
        // console.log('Will send response');
      },
    }
  }
}

const authMiddleware = () => ({
  requestDidStart: async () => ({
    didEncounterErrors: async (requestContext) => {
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

const apolloServer = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginLandingPageLocalDefault({ includeCookies: true }), authMiddleware()],
})

export default startServerAndCreateNextHandler(apolloServer, {
  context: async (req, res) => {
    return { req, res }
  },
})
