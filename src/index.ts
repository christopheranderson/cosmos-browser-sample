import { TodoService } from "./TodoService";
import { ITodo } from "./ITodo";

const todoService: TodoService = new TodoService();
const todosDiv: HTMLElement = document.getElementById("todos") || document.body;

(window as any).addTodo = async () => {
  const textElement = document.getElementById("todoText");
  if (!textElement) {
    return;
  }
  if (!(textElement as HTMLInputElement).value) {
    return;
  }
  (textElement as HTMLInputElement).disabled = true;
  try {
    await todoService.addItem({
      id: String(Math.floor(Math.random() * 1000000)),
      description: (textElement as HTMLInputElement).value,
      userId: "chrande"
    });
    (textElement as HTMLInputElement).value = "";
  } catch (err) {
    console.error(err);
  } finally {
    (textElement as HTMLInputElement).disabled = false;
  }
};

async function start() {
  await todoService.onUpdates("chrande", (item?: ITodo) => {
    if (item) {
      const child = document.createElement("div");
      child.innerText = `${item.id}: ${item.description}`;
      todosDiv.prepend(child);
    }
  });
}

start().catch(err => {
  console.error(err);
});
