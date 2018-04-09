import { Service } from "typedi";
import { Server } from "../server";
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { GraphQLSchema } from 'graphql';
import * as bodyParser from 'body-parser';
import { makeExecutableSchema } from 'graphql-tools';
import "reflect-metadata";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { UsersKafka } from "../kafka/UsersKafka";

interface ctx {
  kafka: UsersKafka,
};

// The GraphQL schema in string form
const typeDefs = `
  type Query { users: [User] }
  type Mutation { createUser(firstName: String): mutationResult }
  type User { id: Int, firstName: String }
  type mutationResult { success: Boolean }
`;

@Service()
export class UsersGraphql {
  server: Server;
  kafka: UsersKafka;

  public initialize(server: Server, kafka: UsersKafka) {
    this.server = server;
    this.kafka = kafka;

    // The resolvers
    const resolvers = {
      Query: {
        users: () => this.getUsers(),
      },
      Mutation: {
        createUser(obj: any, { firstName }: { firstName: string }, context: ctx) {
          return {
            success: context.kafka.send(firstName),
          };
        },
      },
    };

    // Put together a schema
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });

    server.app.use('/graphql', bodyParser.json(), graphqlExpress({
      schema: schema,
      context: {
        kafka: this.kafka,
      },
    }));
    server.app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
  }

  private getUsers() {
    return this.server.connection.getRepository(User).find();
  }
}
