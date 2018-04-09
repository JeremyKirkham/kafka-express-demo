import { Server } from "../Server";
import { Container } from "typedi";
import { createConnection } from "typeorm";
import { IndexController } from '../controllers';
import { UsersGraphql } from '../graphql/UsersGraphql';
import { UsersKafka } from "../kafka/UsersKafka";

//  Init server.
const server = Container.get(Server);
const db = createConnection();
server.initialize(db);

// The port the express app will listen on
const port: number = 3000;
server.app.set("port", 3000);

server.ready.then(() => {
  // Init Kafka.
  const usersKafka = Container.get(UsersKafka);
  usersKafka.initialize(server);

  // Init GraphQL.
  const usersGraphql = Container.get(UsersGraphql);
  usersGraphql.initialize(server, usersKafka);

  // Default path.
  server.app.use('/', IndexController);

  // Listen.
  server.app.listen(port, () => {
      // Success callback
      console.log(`Listening at http://localhost:${port}/`);
  });
});
