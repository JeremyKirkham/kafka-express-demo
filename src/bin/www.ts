import { Server } from "../Server";
import { Container } from "typedi";
import { createConnection } from "typeorm";
import { IndexController } from '../controllers';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { GraphQLSchema } from 'graphql';
import * as bodyParser from 'body-parser';
import { makeExecutableSchema } from 'graphql-tools';
import "reflect-metadata";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { EntityManager } from "typeorm";

const server = Container.get(Server);
const db = createConnection();
server.initialize(db);

// The GraphQL schema in string form
const typeDefs = `
  type Query { users: [User] }
  type User { id: Int, firstName: String }
`;

// The port the express app will listen on
const port: number = 3000;
server.app.set("port", port);

server.ready.then(() => {

  // The resolvers
  const resolvers = {
    Query: {
      users: () => server.connection.getRepository(User).find(),
    },
  };

  // Put together a schema
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });


  server.app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema }));
  server.app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
  server.app.use('/', IndexController);
  server.app.listen(port, () => {
      // Success callback
      console.log(`Listening at http://localhost:${port}/`);
  });
});
