import { TodoService } from "./TodoService";
import { Todo } from "./Todo";
import { Resource } from "@azure/cosmos";

const todoService: TodoService = new TodoService();
const todosDiv: HTMLElement =
  document.getElementById("todos") || document.createElement("div");
const userId = "Chris"; // hard coded since this sample doesn't have auth

const elementsById = new Map<string, HTMLElement>();

(window as any).addTodo = async () => {
  const textElement: HTMLInputElement = document.getElementById(
    "todoText"
  ) as HTMLInputElement;
  if (!textElement) {
    return;
  }
  if (!textElement.value) {
    return;
  }
  textElement.disabled = true;
  try {
    await todoService.addItem({
      id: String(Math.floor(Math.random() * 1000000)),
      description: textElement.value,
      userId: userId
    });
    textElement.value = "";
  } catch (err) {
    console.error(err);
  } finally {
    textElement.disabled = false;
  }
};

async function onComplete(e: Event) {
  const checkbox: HTMLInputElement = e.target as HTMLInputElement;
  if (!checkbox) return;
  const id = checkbox.value;
  checkbox.disabled = true;
  await todoService.completeItem(id, userId);
  markCompleted(id);
}

function markCompleted(itemId: string) {
  if (elementsById.has(itemId)) {
    const element = elementsById.get(itemId);
    if (!element)
      throw new Error("Error trying to find element to mark complete");
    element.remove();
  }
}

async function start() {
  await todoService.onUpdates(userId, (item?: Todo & Resource) => {
    if (item) {
      if (item.completed) {
        markCompleted(item.id);
        return;
      }
      const child = document.createElement("div");
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = item.id;
      checkbox.onchange = onComplete;
      checkbox.classList.add("todo-item-checkbox");
      child.classList.add("todo-item");
      label.innerText = `${item.description}`;
      const createdOn = new Date((item._ts as any) * 1000);
      label.title = `${item.id} - created on ${createdOn.toDateString()}`;
      child.append(checkbox);
      child.append(label);
      elementsById.set(item.id, child);
      todosDiv.prepend(child);
    }
  });
}

start().catch(err => {
  console.error(err);
});
