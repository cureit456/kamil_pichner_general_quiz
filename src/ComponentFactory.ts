import { Question } from "./components/base/Question";
import { Timer } from "./components/base/Timer";
import { EndPage } from "./pages/EndPage";
import { QuizPage } from "./pages/QuizPage";
import { StartPage } from "./pages/StartPage";

export class ComponentFactory {
  public static initilizeComponents() {
    window.customElements.define(StartPage.TAG_NAME, StartPage);
    window.customElements.define(QuizPage.TAG_NAME, QuizPage);
    window.customElements.define(Timer.TAG_NAME, Timer);
    window.customElements.define(Question.TAG_NAME, Question);
    window.customElements.define(EndPage.TAG_NAME, EndPage);
  }
}
