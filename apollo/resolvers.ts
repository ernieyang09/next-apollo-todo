/*
decode should put into middleware
*/
import { GraphQLError } from 'graphql'
import { createBucketClient } from '@cosmicjs/sdk'
import jwt from 'jsonwebtoken'
const SECRET = 'SECRET'

const { bucketSlug, readKey, writeKey } = process.env

const bucket = createBucketClient({
  bucketSlug,
  readKey,
  writeKey,
})

const createToken = (props, secret) => jwt.sign(props, secret, { expiresIn: '1y' })

const checkAuth = (jwtToken) => {
  if (!jwtToken) {
    throw new GraphQLError('Not login', {
      extensions: {
        code: 'LOGIN_REQUIRED',
      },
    })
  }
  const decoded = jwt.verify(jwtToken, SECRET)
  if (decoded.exp * 1000 < new Date().getTime()) {
    throw new GraphQLError('Login expired', {
      extensions: {
        code: 'LOGIN_EXPIRED',
      },
    })
  }
  return decoded
}

export const resolvers = {
  Query: {
    async me(_, __, { req }) {
      let result

      try {
        const { jwtToken } = req.cookies
        const decoded = checkAuth(jwtToken)

        // it should implement __resolveReference for the real graphql
        const r = await bucket.objects
          .findOne({
            type: 'users',
            id: decoded.id,
          })
          .depth(1)

        result = {
          id: decoded.id,
          username: decoded.username,
          todos: r.object.metadata.todos.map((t) => ({
            id: t.id,
            title: t.title,
            tag: t.metadata.tag,
          })),
        }
      } catch (e) {
        // console.log(e)
      }

      return result
    },

    async statusList() {
      let result = []
      try {
        const r = await bucket.objectTypes.findOne('status')
        result = r.object_type.metafields[0].options
      } catch (e) {}
      return result
    },
  },
  Mutation: {
    async login(_, { username, password }, { req, res }) {
      let result = false
      // TODO bcrypt
      try {
        const r = await bucket.objects.findOne({
          type: 'users',
          'metadata.username': username,
          'metadata.password': password,
        })

        const token = createToken({ id: r.object.id, username }, SECRET)
        res.setHeader('set-cookie', `jwtToken=${token}; path=/; httponly;`)
        result = true
      } catch (e) {
        if (e.status !== 404) {
          // TODO
        }
      }

      return result
    },
    async logout(_, __, { res }) {
      let result = false
      try {
        res.setHeader('set-cookie', `jwtToken=; path=/; httponly; Max-Age=0;`)
        result = true
      } catch (e) {}
      return result
    },
    async createTodo(_, { title }, { req }) {
      let result
      try {
        const { jwtToken } = req.cookies
        const decoded = checkAuth(jwtToken)

        const r = await bucket.objects.insertOne({
          title,
          type: 'todos',
          metadata: {
            tag: 'undo',
          },
        })

        const userR = await bucket.objects.findOne({
          type: 'users',
          id: decoded.id,
        })

        // TODO ..
        await bucket.objects.updateOne(decoded.id, {
          metadata: {
            todos: [r.object.id, ...(userR.object.metadata.todos || [])],
          },
        })

        console.log(77)

        result = r.object.id
      } catch (e) {
        throw e
      }
      return result
    },
    async updateTodo(_, { id, status }, { req }) {
      let result = false
      try {
        // TODO check if this todo belong to the user
        // just save api request for free quota here
        await bucket.objects.updateOne(id, {
          metadata: {
            tag: status,
          },
        })

        result = true
      } catch (e) {
        console.log(e)
      }
      return result
    },
    async deleteTodo(_, { id }, { req }) {
      let result = false
      try {
        const { jwtToken } = req.cookies
        const decoded = jwt.verify(jwtToken, SECRET)
        const userR = await bucket.objects.findOne({
          type: 'users',
          id: decoded.id,
        })

        // should implement this with update function
        if (!userR.object.metadata.todos.includes(id)) {
          throw new Error('not found id')
        }

        await bucket.objects.deleteOne(id)

        await bucket.objects.updateOne(decoded.id, {
          metadata: {
            todos: userR.object.metadata.todos.filter((t) => t.id !== id),
          },
        })

        result = true
      } catch (e) {
        console.log(e)
      }
      return result
    },
  },
}
