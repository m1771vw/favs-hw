const schema = `
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
    firstName: String!
    lastName: String!
    phoneNumber: String!
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

export default schema
