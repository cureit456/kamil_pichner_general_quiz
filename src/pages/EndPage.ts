import { IQuiz } from "../models/IQuiz";
import { UserAnswer } from "../models/UserAnswer";
import { TimerData, TimerTool } from "../utils/TimerTool";
import { EndPageModel } from './QuizPage';

export class EndPage extends HTMLElement {
  public static readonly TAG_NAME = "end-page";
  private _userAnswers!: UserAnswer;
  private _quizModel!: IQuiz;
  private _points: string = "";
  private _stats!: TimerData;

  public setModel(endPageModel:EndPageModel): void {
    this._userAnswers = endPageModel.userAnswers;
    this._quizModel = endPageModel.quizModel;
    this.countPoints();
  }

  public connectedCallback() {
    this.redner();
  }

  private countPoints(): void {
    let counter = 0;

    Object.entries(this._userAnswers).forEach(([questionID, answerID]) => {
      if (
        this._quizModel.questions[parseInt(questionID)].answers[
          parseInt(answerID) - 1
        ].correct
      ) {
        counter++;
      }
    });

    this._points = `${counter} / ${this._quizModel.questions.length}`;
  }

  private redner(): void {
    this.innerHTML = "";

    this._stats = JSON.parse(
      localStorage.getItem(TimerTool.TIME_STORAGE_KEY) as string
    ) as TimerData;

    const allTIme = Object.values(this._stats).reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );

    const fullTIme = 5 * 60;
    
    this.innerHTML = `
    <span> Pozosostały czas: ${this.formatSeconds(fullTIme - allTIme)}</span>
    <span>Czas spędzony na teście: ${this.formatSeconds(allTIme)}</span>
    <span>Ilosc punktów: ${this._points}</span>
    <div class="all-statistics"></div>
    `;
    this.renderStatiscs();
  }
  private formatSeconds(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  private renderStatiscs(): void {
    const allStatsistics = this.querySelector(".all-statistics") as HTMLElement;

    Object.entries(this._userAnswers).forEach(([questionID, answerID]) => {
      const question = document.createElement("span");
      const list = document.createElement("ul");

      const correctAnswer = document.createElement("li");
      const userAnswer = document.createElement("li");
      const timeSpend = document.createElement("li");

      question.textContent =
        this._quizModel.questions[parseInt(questionID)].question;

      correctAnswer.textContent = `Prawidłowa odpowiedź to ${
        this._quizModel.questions[parseInt(questionID)].answers.filter(
          (answer) => answer.correct
        )[0].answer
      }`;
      userAnswer.textContent = `Twoja odpowiedź to ${
        this._quizModel.questions[parseInt(questionID)].answers[
          parseInt(answerID) - 1
        ].answer
      }`;
      timeSpend.textContent = `Czas spędzony na pytaniu: ${this.formatSeconds(
        this._stats[parseInt(questionID)]
      )}`;

      [correctAnswer, userAnswer, timeSpend].forEach((element) => {
        list.appendChild(element);
      });
      allStatsistics.appendChild(list);
    });
  }
}
