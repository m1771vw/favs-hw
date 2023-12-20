import { Friendship, Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type CreateFriendshipArgs = {
	data: Prisma.FriendshipCreateInput
}

const friendshipResolvers = {
	Query: {
		friends: async (__: any, { userId }: { userId: string }): Promise<Friendship[]> => {
			const userFriends = await prisma.friendship.findMany({
				where: {
					user_id: userId,
				},
			})
			return userFriends
		},
	},
	Mutation: {
		createFriendship: async (__: any, { data }: CreateFriendshipArgs): Promise<Friendship> => {
			const friendship = await prisma.friendship.create({
				data,
			})
			return friendship
		},
	},
}

export default friendshipResolvers
