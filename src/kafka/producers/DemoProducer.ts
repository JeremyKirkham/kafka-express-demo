import * as Kafka from "node-rdkafka";
import { Service } from "typedi";

const producer = new Kafka.Producer({
  'metadata.broker.list': 'kafka:9092',
}, {});

@Service()
export class DemoProducer {
  public send(msg: string) {
    try {
      producer.produce(
        'topic1',
        null,
        Buffer.from(msg, 'utf-8'),
        'Stormwind',
        Date.now(),
      );
    } catch (err) {
      console.error('A problem occurred when sending our message');
      console.error(err);
    }
  }

  public initialize(): void {
    producer.connect({});
  }
}
