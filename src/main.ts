import { ComponentFactory } from "./ComponentFactory";
import "./style.css";

ComponentFactory.initilizeComponents();

initialize();

function initialize(): void {
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
      <start-page></start-page>
`;
  document.addEventListener("restart", () => initialize());
}
