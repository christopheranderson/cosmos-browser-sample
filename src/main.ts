import { TodoService } from "./TodoService";
import { ITodo } from "./ITodo";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function main(): Promise<void> {
  const todoService: TodoService = new TodoService();
  await todoService.onUpdates("chrande", (item?: ITodo) => {
    console.log(item);
  });
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .catch(() => {
    console.log("done");
  });
