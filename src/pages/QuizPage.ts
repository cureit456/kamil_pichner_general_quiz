import { Question } from "../components/base/Question";
import { IQuiz } from "../models/IQuiz";
import Questions from "../storage/Questions.json";
import { UserAnswer } from "../models/UserAnswer";
import { TimerTool } from "../utils/TimerTool";
import { Timer } from "../components/base/Timer";

export type EndPageModel = {
  userAnswers: UserAnswer;
  quizModel: IQuiz;
}

export class QuizPage extends HTMLElement {
  public static readonly TAG_NAME = "quiz-page";

  private _questionsContainer!: HTMLElement;
  private _quizModel!: IQuiz;
  private _currentQuestionId: number = 0;
  private _nextButton!: HTMLButtonElement;
  private _previousButton!: HTMLButtonElement;
  private _endButton!: HTMLButtonElement;
  private _question!: Question;
  private _userAnswers: UserAnswer = {};
  private _timerTool: TimerTool = new TimerTool();
  private _quizTimerElement!: Timer;
  private _cancelTest!:HTMLButtonElement;

  constructor() {
    super();

    this.convertJsonToModel();
  }

  public connectedCallback() {
    this.innerHTML = `
      <button type="button" id="cancel">Przerwij test</button>
      <quiz-timer></quiz-timer>
      <div class="question-container"></div>
      <div class="buttons-container">
      <button type="button" id="previous">Poprzednie pytanie</button>

      <button type="button" id="next">Następne pytanie</button>
      <button type="button" id="end">Zakończ</button>

      </div>
    `;

    this.bindElements();

    this._question = new Question();

    localStorage.setItem(
      "currentQuestion",
      JSON.stringify(this._quizModel.questions[this._currentQuestionId])
    );

    this._questionsContainer.appendChild(this._question);

    this.showQuestionAndMeasureTime();

    this.bindListners();
  }

  private bindElements(): void {
    this._questionsContainer = this.querySelector(
      ".question-container"
    ) as HTMLElement;
    this._quizTimerElement = this.querySelector("quiz-timer") as Timer;
    this._cancelTest = this.querySelector("#cancel") as HTMLButtonElement;

    this.createButtons();
    this.disableButtons();
  }

  private shuffleQuestions(): void {
    for (let i = this._quizModel.questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this._quizModel.questions[i], this._quizModel.questions[j]] = [
        this._quizModel.questions[j],
        this._quizModel.questions[i],
      ];
    }
  }
  private openEndPage(): void {
    this._timerTool.startMeasurement("-1");

    const model: EndPageModel = {quizModel:this._quizModel, userAnswers:this._userAnswers};

    const event = new CustomEvent<EndPageModel>('openendpage', {detail:model,bubbles:true});
    this.dispatchEvent(event);

  }

  private onTimeEndHandler(): void {
    this.openEndPage();
  }

  private onSelectOptionHandle(event: Event): void {
    const data = event.target as HTMLInputElement;

    this._userAnswers[this._currentQuestionId] = data.value;

    if (
      Object.keys(this._userAnswers).length == this._quizModel.questions.length
    ) {
      this._endButton.disabled = false;
    } else {
      this._endButton.disabled = true;
    }
  }

  private onNextButtonClickHandler(): void {
    if (this._currentQuestionId < this._quizModel.questions.length) {
      this._currentQuestionId++;
      this._previousButton.disabled = false;
    }

    if (this._currentQuestionId == this._quizModel.questions.length - 1) {
      this._nextButton.disabled = true;
    }

    this.showQuestionAndMeasureTime();
  }

  private onPreviounsClickHadnler(): void {
    if (this._currentQuestionId > 0) {
      this._currentQuestionId--;
      this._nextButton.disabled = false;
    }
    if (this._currentQuestionId == 0) {
      this._previousButton.disabled = true;
    }

    this.showQuestionAndMeasureTime();
  }

  private onEndClickHandler(): void {
    this.openEndPage();
  }
  private bindListners(): void {
    this._quizTimerElement.addEventListener("timeend", () =>
      this.onTimeEndHandler()
    );

    this.addEventListener("change", (event: Event) =>
      this.onSelectOptionHandle(event)
    );

    this._nextButton.addEventListener("click", () =>
      this.onNextButtonClickHandler()
    );
    this._previousButton.addEventListener("click", () =>
      this.onPreviounsClickHadnler()
    );
    this._endButton.addEventListener("click", () => this.onEndClickHandler());
    this._cancelTest.addEventListener("click", () => this.onCancelHandler());
  }
  private onCancelHandler(): void {
    this.dispatchEvent(new CustomEvent('restart',{bubbles:true}));

  }

  private createButtons(): void {
    this._nextButton = this.querySelector("#next") as HTMLButtonElement;
    this._previousButton = this.querySelector("#previous") as HTMLButtonElement;
    this._endButton = this.querySelector("#end") as HTMLButtonElement;
  }
  private disableButtons(): void {
    this._previousButton.disabled = true;
    this._endButton.disabled = true;
  }

  private showQuestionAndMeasureTime(): void {
    this._question.render(
      this._quizModel.questions[this._currentQuestionId],
      this._userAnswers[this._currentQuestionId]
    );
    this._timerTool.startMeasurement(this._currentQuestionId.toString());
  }

  private convertJsonToModel(): void {
    const jsonString = JSON.stringify(Questions);

    this._quizModel = JSON.parse(jsonString) as IQuiz;

    this.shuffleQuestions();
  }
}
