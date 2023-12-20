import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { FriendRequest, Friendship, Prisma, PrismaClient, User } from '@prisma/client'
// import schema from './graphql/schema'
// import userResolvers from 'graphql/resolvers/user'
// import friendshipResolvers from 'graphql/resolvers/friendship'
// import friendRequestResolvers from 'graphql/resolvers/friendRequest'
// import resolvers from './graphql/resolvers'
// const resolvers = [userResolvers, friendshipResolvers, friendRequestResolvers]

const prisma = new PrismaClient()

type CreateUserArgs = {
	data: Prisma.UserCreateInput
}

type CreateFriendshipArgs = {
	data: Prisma.FriendshipCreateInput
}

type CreateFriendRequestArgs = {
	data: Prisma.FriendRequestCreateInput
}

const schema = `
type User {
  id: String!
  first_name: String
  last_name: String
  phone_number: String
  username: String!
  created_at: String!
  updated_at: String!
  friendships: [Friendship!]!
}

type Friendship {
  id: String!
  user_id: String!
  friend_user_id: String!
  created_at: String!
  updated_at: String!
  requestor: User!
  requested: User!
}

type FriendRequest {
  id: String!
  user_requestor_id: String!
  user_requested_id: String!
  status: String!
  created_at: String!
  updated_at: String!
  requestor: User!
  requested: User!
}

enum ResponseType {
  ACCEPTED
  REJECTED
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
  responseFriendRequest(friendRequestId: String! response: ResponseType!): FriendRequest!
}

input CreateUserInput {
  first_name: String!
  last_name: String!
  phone_number: String!
  username: String!
}

input CreateFriendshipInput {
  user_id: ID!
  friend_user_id: ID!
}

input CreateFriendRequestInput {
  user_requestor_id: ID!
  user_requested_id: ID!
  status: String = "PENDING"
}

`

type FriendRequestResponse = {
	friendRequestId: string
	response: 'ACCEPTED' | 'REJECTED'
}

const resolvers = {
	Query: {
		user: async (_: any, { id }: { id: string }): Promise<User> => {
			const user = await prisma.user.findUnique({
				where: {
					id,
				},
			})
			if (!user) {
				throw new Error(`User with ID ${id} not found.`)
			}
			return user
		},

		users: async (): Promise<User[]> => {
			const users = await prisma.user.findMany()
			return users
		},

		friendRequests: async (): Promise<FriendRequest[]> => {
			const friendRequests = await prisma.friendRequest.findMany()
			return friendRequests
		},

		friends: async (__: any, { userId }: { userId: string }): Promise<any> => {
			const userFriends = await prisma.friendship.findMany({
				where: {
					user_id: userId,
				},
			})
			return userFriends.map((friendship) => {
				return prisma.user.findUnique({
					where: {
						id: friendship.friend_user_id,
					},
				})
			})
		},
	},

	Mutation: {
		createUser: async (__: any, { data }: CreateUserArgs): Promise<User> => {
			const user = await prisma.user.create({
				data,
			})
			return user
		},

		createFriendship: async (__: any, { data }: CreateFriendshipArgs): Promise<Friendship> => {
			const friendship = await prisma.friendship.create({
				data,
			})
			return friendship
		},

		createFriendRequest: async (__: any, { data }: CreateFriendRequestArgs): Promise<FriendRequest> => {
			const userRequestor = await prisma.user.findUnique({
				where: {
					id: data.user_requestor_id,
				},
			})

			const userRequested = await prisma.user.findUnique({
				where: {
					id: data.user_requested_id,
				},
			})

			if (!userRequestor || !userRequested) {
				throw new Error('One or both users do not exist.')
			}

			const existingRequest = await prisma.friendRequest.findFirst({
				where: {
					OR: [
						{ user_requestor_id: data.user_requestor_id, user_requested_id: data.user_requested_id },
						{ user_requested_id: data.user_requestor_id, user_requestor_id: data.user_requested_id },
					],
				},
			})

			if (existingRequest) {
				throw new Error('A friend request already exists between these users.')
			}

			const existingFriendship = await prisma.friendship.findFirst({
				where: {
					OR: [
						{
							user_id: data.user_requestor_id,
							friend_user_id: data.user_requested_id,
						},
						{
							user_id: data.user_requested_id,
							friend_user_id: data.user_requestor_id,
						},
					],
				},
			})

			if (existingFriendship) {
				throw new Error('Users are already friends.')
			}

			const friendRequest = await prisma.friendRequest.create({
				data,
			})

			return friendRequest
		},

		responseFriendRequest: async (
			_: any,
			{ friendRequestId, response }: FriendRequestResponse
		): Promise<FriendRequest | null> => {
			const friendRequest = await prisma.friendRequest.findUnique({
				where: {
					id: friendRequestId,
				},
			})

			if (!friendRequest) {
				throw new Error('Friend request not found.')
			}

			if (friendRequest.status === 'ACCEPTED' || friendRequest.status === 'REJECTED') {
				throw new Error('Friend request has already been responded to.')
			}

			if (response === 'ACCEPTED') {
				await prisma.friendRequest.update({
					where: {
						id: friendRequestId,
					},
					data: {
						status: 'ACCEPTED',
					},
				})

				await prisma.friendship.createMany({
					data: [
						{
							user_id: friendRequest.user_requestor_id,
							friend_user_id: friendRequest.user_requested_id,
						},
						{
							user_id: friendRequest.user_requested_id,
							friend_user_id: friendRequest.user_requestor_id,
						},
					],
				})
			} else if (response === 'REJECTED') {
				await prisma.friendRequest.update({
					where: {
						id: friendRequestId,
					},
					data: {
						status: 'REJECTED',
					},
				})
			} else {
				throw new Error("Invalid response parameter. It must be 'ACCEPTED' or 'REJECTED'.")
			}

			const updatedFriendRequest = await prisma.friendRequest.findUnique({
				where: {
					id: friendRequestId,
				},
			})

			return updatedFriendRequest
		},
	},
}

async function runServer() {
	const server = new ApolloServer({
		typeDefs: schema,
		resolvers,
	})

	const { url } = await startStandaloneServer(server, {
		listen: { port: 3003 },
	})

	console.log(`🚀  Server ready at: ${url}`)
}

runServer().catch((error) => {
	console.error('Error starting the server:', error)
})
