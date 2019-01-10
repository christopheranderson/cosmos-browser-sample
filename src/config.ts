// These are loaded via WebPack Define plugin. Don't check-in your prod credentials :)
declare let TODOAPP_ENDPOINT: string;
declare let TODOAPP_KEY: string;

export const config = {
  endpoint: TODOAPP_ENDPOINT || "https://localhost:8081",
  key:
    TODOAPP_KEY ||
    "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=="
};
