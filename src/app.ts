import * as express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { GraphQLSchema } from 'graphql';
import * as bodyParser from 'body-parser';
import { makeExecutableSchema } from 'graphql-tools';

// Some fake data
const books = [
  {
    title: "Harry Potter and the Sorcerer's stone",
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

// The GraphQL schema in string form
const typeDefs = `
  type Query { books: [Book] }
  type Book { title: String, author: String }
`;

// The resolvers
const resolvers = {
  Query: { books: () => books },
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Import WelcomeController from controllers entry point
import { IndexController } from './controllers';

// Create a new express application instance
const app: express.Application = express();

// Mount the WelcomeController at the /welcome route
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema }));
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
app.use('/', IndexController);

export default app;
