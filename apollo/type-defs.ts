import { gql } from 'graphql-tag'

export const typeDefs = gql`
  type TODO {
    id: ID!
    title: String!
    tag: String!
  }
  type User {
    id: ID!
    username: String!
    todos: [TODO]!
  }

  type Status {
    key: String!
    value: String!
  }

  type Query {
    me: User
    statusList: [Status]!
  }

  type Mutation {
    login(username: String!, password: String!): Boolean
    logout: Boolean
    createTodo(title: String!): ID!
    updateTodo(id: ID!, status: String!): Boolean!
    deleteTodo(id: ID!): Boolean!
  }
`
