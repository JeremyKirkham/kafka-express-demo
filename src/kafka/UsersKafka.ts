import { Service } from "typedi";
import * as Kafka from "node-rdkafka";
import { Server } from "../server";
import { User } from "../entity/User";

const consumer = new Kafka.KafkaConsumer({
  'group.id': 'kafka',
  'metadata.broker.list': 'kafka:9092',
}, {});

const producer = new Kafka.Producer({
  'metadata.broker.list': 'kafka:9092',
}, {});

@Service()
export class UsersKafka {
  server: Server;

  public initialize(server: Server): void {
    this.server = server;
    consumer.connect({});
    producer.connect({});
    this.receive();
  }

  public send(firstName: string): boolean {
    console.log('send called');
    try {
      producer.produce(
        'users',
        null,
        Buffer.from(firstName, 'utf-8'),
        null,
        Date.now(),
      );
      return true;
    } catch (err) {
      console.error('A problem occurred when sending our message');
      console.error(err);
      return false;
    }
  }

  public receive(): void {
    console.log('receive called');
    const conn = this.server.connection;

    consumer
    .on('ready', function() {
      consumer.subscribe(['users']);
      consumer.consume();
    })
    .on('data', function(data) {
      const firstName = data.value.toString();
      let user = new User();
      user.firstName = firstName;
      conn.manager
        .save(user)
        .then((user: User) => {
            console.log("--> User has been saved. User id is", user.id);
        });
    });
  }
}
