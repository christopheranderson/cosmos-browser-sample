import {
  CosmosClient,
  Items,
  FeedOptions,
  QueryIterator,
  IHeaders,
  Resource
} from "@azure/cosmos";
import { Todo } from "./Todo";
import { config } from "./config";

export class TodoService {
  private todos: Items;
  constructor() {
    const client: CosmosClient = new CosmosClient({
      endpoint: config.endpoint,
      key: config.key
    });

    this.todos = client.database("TodoApp").container("Todo").items;
  }

  public async addItem(item: Todo): Promise<void> {
    await this.todos.create<Todo>(item);
  }

  public async completeItem(itemId: string, userId: string) {
    const { body: item } = await this.todos.container
      .item(itemId, userId)
      .read<Todo>();
    if (!item) return;
    item.completed = true;
    await this.todos.container.item(itemId, userId).replace(item);
  }

  public async onUpdates(
    userId: string,
    fn: (item?: Todo & Resource) => void,
    shouldCancel: { cancel: boolean } = { cancel: false }
  ): Promise<void> {
    const iterator = this.todos.readChangeFeed<Todo>(userId, {
      startFromBeginning: true
    });
    while (!shouldCancel.cancel) {
      try {
        const { result: items, headers } = await iterator.executeNext();
        for (const item of items) {
          fn(item);
        }
        if (items.length === 0) {
          await this.sleep(1000);
        }
      } catch (err) {
        console.error(err);
        console.error("onUpdates is aborting");
        return;
      }
    }
  }

  /* public async onUpdates2(
    userId: string,
    fn: (item?: ITodo & Resource) => void,
    shouldCancel: { cancel: boolean } = { cancel: false }
  ): Promise<void> {
    const feedOptions: FeedOptions = {
      a_im: "Incremental feed",
      partitionKey: userId
    };
    let iterator: QueryIterator<ITodo & Resource> = this.todos.readAll<
      ITodo & Resource
    >(feedOptions);
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
      iterator = this.todos.readAll<ITodo & Resource>(feedOptions);
      await this.sleep(1000);
    }
  } */

  private async sleep(durationInMilliseconds: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, durationInMilliseconds);
    });
  }
}
