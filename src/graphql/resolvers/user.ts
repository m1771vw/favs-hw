import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userResolvers = {
  Query: {
    user: async (_, { id }: { id: string }) => {
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

		users: async () => {
			const users = await prisma.user.findMany()
			return users
		},
  },
  Mutation: {
    createUser: async (_, { data }) => {
			const user = await prisma.user.create({
				data,
			})
			return user
		},
  },
};

export default userResolvers;
