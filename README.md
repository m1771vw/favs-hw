# favs-hw
Homework assessment for Favs

## Project Setup
This project will assume you have `Node.js`, `PostgreSQL` setup on your computer previously

## Getting Started

### 1. Clone the Repository

1. Clone the repository:
```bash
git clone <repository_xurl>
cd <project_directory>
```


### 2. Install Dependencies

2. Use npm to install project dependencies listed in `package.json`:

```bash

npm install

```


### 3. Configure Environment Variables

3. Create an `.env` file. Usually we won't keep this here, but for demonstration purposes will give you the .env

```
DATABASE_URL="postgresql://postgres:password@localhost:5433/favsdb?schema=public"
```

### 4. Database setup

4. We're going to assume you have Postgres set up with default options. There'll be a script to be run to create a database and a user for that database.

If there are some differences, please update the appropriate tags

```bash
psql -U postgres -d postgres -h localhost -p 5432 -f ./scripts/create_database.sql

```
### 5. Prisma Setup

5. We need to use Prisma to set up your database. 

```bash
npx prisma migrate save --name first_migration
npx prisma migrate up 
npx prisma db push 

```

### 6. Start the Project

6. Now we can start the project

```bash
npm run start
```


7. You can now navigate to [here](http://localhost:3003) to see the GraphQL Interface. It's mapped to localhost:3003 so if 3003 is being used please change it to something else.


### Example Queries and Mutations

Example queries and mutations can be found in scripts/graphql_scripts.js.

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

You can accept the request like this

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

