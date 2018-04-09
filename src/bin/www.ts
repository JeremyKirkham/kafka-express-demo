import { Server } from "../Server";
import { Container } from "typedi";
import { createConnection } from "typeorm";
import { IndexController } from '../controllers';
import { UsersGraphql } from '../graphql/UsersGraphql';
import { DemoConsumer } from "../kafka/consumers/DemoConsumer";
import { DemoProducer } from "../kafka/producers/DemoProducer";

const demoConsumer = Container.get(DemoConsumer);
const demoProducer = Container.get(DemoProducer);
demoProducer.initialize();
demoConsumer.initialize();


//  Init server.
const server = Container.get(Server);
const db = createConnection();
server.initialize(db);


// The port the express app will listen on
const port: number = 3000;
server.app.set("port", port);

server.ready.then(() => {
  const usersGraphql = Container.get(UsersGraphql);
  usersGraphql.initialize(server, demoProducer);
  server.app.use('/', IndexController);
  server.app.listen(port, () => {
      // Success callback
      console.log(`Listening at http://localhost:${port}/`);
  });
});
