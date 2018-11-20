import {
  CosmosClient,
  Items,
  FeedOptions,
  QueryIterator,
  IHeaders
} from "@azure/cosmos";
import { ITodo } from "./ITodo";

export class TodoService {
  private todos: Items;
  constructor() {
    const client: CosmosClient = new CosmosClient({
      endpoint: "https://localhost:8081",
      auth: {
        masterKey:
          "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=="
      }
    });

    this.todos = client.database("TodoApp").container("Todo").items;
  }

  public async addItem(item: ITodo): Promise<void> {
    await this.todos.create<ITodo>(item);
  }

  public async onUpdates(
    userId: string,
    fn: (item?: ITodo) => void,
    shouldCancel: { cancel: boolean } = { cancel: false }
  ): Promise<void> {
    const feedOptions: FeedOptions = {
      a_im: "Incremental feed",
      partitionKey: userId
    };
    let iterator: QueryIterator<ITodo> = this.todos.readAll<ITodo>(feedOptions);
    let lastEtag: string = "*";
    while (!shouldCancel.cancel) {
      try {
        do {
          const { result: item, headers } = await iterator.nextItem();
          if (headers && (headers as IHeaders).etag) {
            lastEtag = (headers as IHeaders).etag;
          } else if (item) {
            lastEtag = (item as any)._lsn;
          }
          if (!item) {
            break;
          }
          fn(item);
        } while (iterator.hasMoreResults());
      } catch (err) {
        console.error(err);
        console.error("onUpdates is aborting");
        return;
      }
      feedOptions.accessCondition = {
        type: "IfNoneMatch",
        condition: lastEtag
      };
      iterator = this.todos.readAll<ITodo>(feedOptions);
      await this.sleep(1000);
    }
  }

  private async sleep(durationInMilliseconds: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, durationInMilliseconds);
    });
  }
}
