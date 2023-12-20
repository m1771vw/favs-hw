const generateUsers = `
mutation {
  createUser(data: {
    first_name: "User1FirstName",
    last_name: "User1LastName",
    phone_number: "1234567890",  
    username: "user1"
  }) {
    id
    first_name
    last_name
    phone_number
    username
  }
}

mutation {
  createUser(data: {
    first_name: "User2FirstName",
    last_name: "User2LastName",
    phone_number: "9876543210",
    username: "user2"
  }) {
    id
    first_name
    last_name
    phone_number
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


const retrieveAllUsers = 
`
uery {
  users {
    id
    first_name
    last_name
    phone_number
    username
    created_at
    updated_at
  }
}
`

const singleUserDetail =
`
user(id: "<user_id>") {
  id
  first_name
  last_name
  phone_number
  username
  created_at
  updated_at
}
}
`

const checkFriendshipp = 
`
query {
  friends(userId: "<input user id here>") {
    id
    first_name
    last_name
    phone_number
    username
    created_at
    updated_at
  }
}
`