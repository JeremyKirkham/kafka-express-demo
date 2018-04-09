import "reflect-metadata";
import { Container, Service} from "typedi";
import { Connection, useContainer, EntityManager } from "typeorm";
import * as express from 'express';

@Service()
export class Server {
  public app: express.Application;
  public ready: Promise<void>;
  public connection: Connection;

  public initialize(db: Promise<Connection>): void {
    // Create expressjs application.
    this.app = express();

    this.ready = db.then(async (connection) => {
      // Setup dependency injection.
      this.connection = connection;
      this.dependencyInjection(connection);
    });
  }

  public dependencyInjection(connection: Connection): void {
    useContainer(Container);
    Container.set({
      global: true,
      id: EntityManager,
      value: connection.createEntityManager(),
    });
  }
}
