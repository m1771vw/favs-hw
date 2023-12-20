# favs-hw
Homework assessment for Favs

## Project Setup
This project will assume you have `Node.js`, `PostgreSQL` setup on your computer previously. We will need at least Node 18 for the project to run properly.

## Getting Started

### 1. Clone the Repository

1. Clone the repository:
```bash
git clone https://github.com/m1771vw/favs-hw.git
cd favs-hw
```


### 2. Install Dependencies

2. Use npm to install project dependencies listed in `package.json`:

```bash

npm install

```


### 3. Configure Environment Variables

3. Create an `.env` file. Usually we won't keep this here, but for demonstration purposes will give you the .env example. Please replace username and password with you Postgres information

```
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/favsdb?schema=public"
```

### 4. Database setup

4. We're going to assume you have Postgres set up with default options. There'll be a script to be run to create a database and a user for that database.

If your postgres user isn't postgres, please update the -U tag

```bash
psql -U postgres -d postgres -h localhost -p 5432 -f ./scripts/create_database.sql

```
### 5. Prisma Setup

5. We need to use Prisma to set up your database. 

```bash
npx prisma migrate dev --name first_migration
```

### 6. Start the Project

6. Now we can start the project

```bash
npm run start
```


7. You can now navigate to [here](http://localhost:3003) to see the GraphQL Interface. It's mapped to localhost:3003 so if 3003 is being used please change it to something else.


### Example Queries and Mutations

Example queries and mutations can be found in `scripts/graphql_scripts.js`.

### Add User

Here are some examples from that file 

```
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
```

### Retrieve All Users

```
query {
  users {
    id
    firstName
    lastName
    phoneNumber
    username
    created_at
    updated_at
  }
}
```

### Retrieve User Details

```
query {
  user(id: "<user_id>") {
    id
    firstName
    lastName
    phoneNumber
    username
    created_at
    updated_at
  }
}
```

### Create Friend Request

Here are some for Friend Request. This will require you to get the user id from the created users earlier.

```
mutation {
  createFriendRequest(data: {
    user_requestor_id: "<input user id here>",
    user_requested_id: "<input different id here>",
    status: "pending"
  }) {
    id
    user_requestor_id
    user_requested_id
    status
  }
}

```

### Accepting Friend Request

You can accept the request like this. You can change response to REJECTED as well.

```
mutation {
  responseFriendRequest(
    friendRequestId: "<insert friend request id here>"  
    response: ACCEPTED  
  ) {
    id
    user_requestor_id
    user_requested_id
    status
    created_at
    updated_at
  }
}
```

### Checking Friendship

You can check friendship of a user like this

```
query {
  friends(userId: "<input user id here>") {
    id
    firstName
    lastName
    phoneNumber
    username
    created_at
    updated_at
  }
}
```

# Design Thoughts

- Design of friend list table
    - Picking single rows over a friend list array
        - Array would be simpler at the beginning, but can run into problems once friend list grows
        - Unable to add more data about it
    - Want to add some extra fields, like when they first became friends
- Keeping friend request table separate
    - Thought about having a status on friend list table but ultimately wanted to seaprate it so I can have a history and also see who sent friend request to whom
- Choosing GraphQL library
    - Picked Apollo because it’s pretty standard
    - Lots of documentation
    - Good for scaling , wide range of features
    - More familiar with the structure as well
- How to store friendships
    - Bidirectional or single row
    - Two entries:
        - Pro simple, easy to query
        - Con: Increased storage
    - Single entry:
        - Pro: Less storage
        - Con: Complex queries, could take more time
    - Going with bidirectional: Storage is cheap, speed is better