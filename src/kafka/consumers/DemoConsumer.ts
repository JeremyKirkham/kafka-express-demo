import * as Kafka from "node-rdkafka";
import { Service } from "typedi";

const consumer = new Kafka.KafkaConsumer({
  'group.id': 'kafka',
  'metadata.broker.list': 'kafka:9092',
}, {});

@Service()
export class DemoConsumer {
  public initialize(): void {
    consumer.connect({});

    consumer
    .on('ready', function() {
      consumer.subscribe(['topic1']);
      consumer.consume();
    })
    .on('data', function(data) {
      console.log('Kafka message consumed: ' + data.value.toString());
    });
  }
}
