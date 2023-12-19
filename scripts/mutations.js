const generateUsers = `
mutation {
  createUser(data: {
    firstName: "User1FirstName",
    lastName: "User1LastName",
    phoneNumber: "1234567890",  
    username: "user1"
  }) {
    id
    firstName
    lastName
    phoneNumber
    username
  }
}

mutation {
  createUser(data: {
    firstName: "User2FirstName",
    lastName: "User2LastName",
    phoneNumber: "9876543210",
    username: "user2"
  }) {
    id
    firstName
    lastName
    phoneNumber
    username
  }
}
`

const generateFriendships = `
mutation {
  createFriendship(data: {
    user_id: "User1Id",
    friend_user_id: "User2Id"
  }) {
    id
    user_id
    friend_user_id
  }
}

mutation {
  createFriendship(data: {
    user_id: "User2Id",
    friend_user_id: "User1Id"
  }) {
    id
    user_id
    friend_user_id
  }
}
`

const generateFriendRequests = `
mutation {
  createFriendRequest(data: {
    user_requestor_id: "User1Id",
    user_requested_id: "User2Id",
    status: "pending"
  }) {
    id
    user_requestor_id
    user_requested_id
    status
  }
}

mutation {
  createFriendRequest(data: {
    user_requestor_id: "User2Id",
    user_requested_id: "User1Id",
    status: "pending"
  }) {
    id
    user_requestor_id
    user_requested_id
    status
  }
}
`
const responseFriendRequest = `
mutation {
  responseFriendRequest(
    friendRequestId: "3c3de9bc-f73b-4121-af3c-91cafe020f8d"  
    response: ACCEPTED  
  ) {
    id
    user_requestor_id
    user_requested_id
    status
    created_at
    updated_at
  }
}`
