import { EndPage } from "./EndPage";
import { EndPageModel, QuizPage } from "./QuizPage";

declare global {
  interface HTMLElementEventMap {
    openendpage: CustomEvent<EndPageModel>;
  }
}
export class StartPage extends HTMLElement {
  public static readonly TAG_NAME = "start-page";

  private _questionsContainer!: HTMLElement;
  private _startButton!: HTMLButtonElement;

  public connectedCallback() {
    this.innerHTML = `
    <p> Witaj w ogólnym teście wiedzy przed tobą 10 pytań, twój czas to 5 minut powodzenia !</p>
   
    <div class="questions-container">
    <button id="start-button" type="button">Zacznij</button>
    </div>
    `;

    this.bindElements();
    this.bindListners();
  }

  private bindElements(): void {
    this._questionsContainer = this.querySelector(
      ".questions-container"
    ) as HTMLElement;
    this._startButton = this.querySelector(
      "#start-button"
    ) as HTMLButtonElement;
  }
  private bindListners(): void {
    this._startButton.addEventListener("click", () => this.startQuiz());
    this.addEventListener("openendpage", (event: CustomEvent<EndPageModel>) =>
      this.openEndPageHandler(event)
    );
  }
  private openEndPageHandler(event: CustomEvent<EndPageModel>): void {
    const endPage: EndPage = new EndPage();

    endPage.setModel(event.detail);

    this.innerText = "";
    this.appendChild(endPage);
  }
  private startQuiz(): void {
    const quizPage = new QuizPage();

    this._questionsContainer.innerHTML = "";
    this._questionsContainer.appendChild(quizPage);
  }
}
