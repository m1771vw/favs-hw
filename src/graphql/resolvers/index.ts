import userResolvers from './user';
import friendshipResolvers from './friendship';
import friendRequestResolvers from './friendRequest';

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...friendshipResolvers.Query,
    ...friendRequestResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...friendshipResolvers.Mutation,
    ...friendRequestResolvers.Mutation,
  },
};

export default resolvers;
