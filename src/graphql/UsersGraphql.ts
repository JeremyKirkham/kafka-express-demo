import { Service } from "typedi";
import { Server } from "../server";
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { GraphQLSchema } from 'graphql';
import * as bodyParser from 'body-parser';
import { makeExecutableSchema } from 'graphql-tools';
import "reflect-metadata";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { DemoProducer } from "../kafka/producers/DemoProducer";

// The GraphQL schema in string form
const typeDefs = `
  type Query { users: [User] }
  type User { id: Int, firstName: String }
`;

@Service()
export class UsersGraphql {
  server: Server;
  producer: DemoProducer

  public initialize(server: Server, producer: DemoProducer) {
    this.server = server;
    this.producer = producer;

    // The resolvers
    const resolvers = {
      Query: {
        users: () => this.getUsers(),
      },
    };

    // Put together a schema
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });

    server.app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema }));
    server.app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
  }

  private getUsers() {
    this.producer.send('getUsers called');
    return this.server.connection.getRepository(User).find()
  }
}
