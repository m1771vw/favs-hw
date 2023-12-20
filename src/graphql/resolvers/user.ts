import { Prisma, PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()

type CreateUserArgs = {
	data: Prisma.UserCreateInput
}

const userResolvers = {
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
	},
	Mutation: {
		createUser: async (__: any, { data }: CreateUserArgs): Promise<User> => {
			const user = await prisma.user.create({
				data,
			})
			return user
		},
	},
}

export default userResolvers
