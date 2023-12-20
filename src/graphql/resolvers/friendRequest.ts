import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const friendRequestResolvers = {
	Query: {
		friendRequests: async () => {
			const friendRequests = await prisma.friendRequest.findMany()
			return friendRequests
		},
	},
	Mutation: {
		createFriendRequest: async (_, { data }) => {
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

		responseFriendRequest: async (_, { friendRequestId, response }) => {
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

export default friendRequestResolvers
