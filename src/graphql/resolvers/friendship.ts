import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const friendshipResolvers = {
	Query: {
		friends: async (_, { userId }: { userId: string }) => {
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
		createFriendship: async (_, { data }) => {
			const friendship = await prisma.friendship.create({
				data,
			})
			return friendship
		},
	},
}

export default friendshipResolvers
