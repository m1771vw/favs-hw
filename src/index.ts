import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

const typeDefs = `
  type User {
    id: String!
    firstName: String
    lastName: String
    phoneNumber: String
    username: String!
    created_at: String!
    updated_at: String!
    friendships: [Friendship!]!
  }
  
  type Friendship {
    id: Int!
    user_id: String!
    friend_user_id: String!
    created_at: String!
    updated_at: String!
    requestor: User!
    requested: User!
  }
  
  type FriendRequest {
    id: Int!
    user_requestor_id: String!
    user_requested_id: String!
    status: String!
    created_at: String!
    updated_at: String!
    requestor: User!
    requested: User!
  }

  type Query {
    user(id: ID!): User
  
    users: [User!]!
  
    friendRequests: [FriendRequest!]!
  
    friends(userId: ID!): [User!]!
  }
  
  type Mutation {
    createUser(data: CreateUserInput!): User!
    createFriendship(data: CreateFriendshipInput!): Friendship!
    createFriendRequest(data: CreateFriendRequestInput!): FriendRequest!
  }

  input CreateUserInput {
    firstName: String!
    lastName: String!
    phoneNumber: String
    username: String!
  }

  input CreateFriendshipInput {
    user_id: ID!
    friend_user_id: ID!
  }

  input CreateFriendRequestInput {
    user_requestor_id: ID!
    user_requested_id: ID!
    status: String!
  }
  
`

const users = []
const friendships = []
const friendRequests = []

const resolvers = {
	Query: {
		user: (_, { id }: { id: string }) => {
			const user = users.find((u) => u.id === id)
			if (!user) {
				throw new Error(`User with ID ${id} not found.`)
			}
			return user
		},

		users: () => {
			return users
		},

		friendRequests: () => {
			return friendRequests
		},

		friends: (_, { userId }: { userId: string }) => {
			const userFriends = friendships
				.filter((friendship) => friendship.user_id === userId)
				.map((friendship) => {
					return users.find((user) => user.id === friendship.friend_user_id)
				})

			return userFriends || []
		},
	},
	Mutation: {
		createUser: (_, { data }) => {
			const user = { id: users.length + 1, ...data }
			users.push(user)
			return user
		},

		createFriendship: (_, { data }) => {
			const friendship = { id: friendships.length + 1, ...data }
			friendships.push(friendship)
			return friendship
		},

		createFriendRequest: (_, { data }) => {
			const friendRequest = { id: friendRequests.length + 1, ...data }
			friendRequests.push(friendRequest)
			return friendRequest
		},
	},
}

const server = new ApolloServer({
	typeDefs,
	resolvers,
})

const { url } = await startStandaloneServer(server, {
	listen: { port: 4000 },
})

console.log(`🚀  Server ready at: ${url}`)
