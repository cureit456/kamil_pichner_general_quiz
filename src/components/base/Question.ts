import { IQuestion } from "../../models/IQuestion";

export class Question extends HTMLElement {
  public static readonly TAG_NAME = "quiz-question";

  public render(questionModel: IQuestion, userAnswerID: string): void {
    this.innerText = "";

    const question = document.createElement("span");

    question.textContent = questionModel.question;

    const answerList = document.createElement("ol");

    questionModel.answers.forEach((q) => {
      const answer = document.createElement("li");

      const input = document.createElement("input") as HTMLInputElement;
      const label = document.createElement("label") as HTMLLabelElement;

      input.type = "radio";
      input.name = questionModel.id.toString();
      input.value = q.id.toString();

      if (userAnswerID && userAnswerID === q.id.toString()) {
        input.checked = true;
      }
      if (userAnswerID) {
        input.disabled = true;
      }
      label.htmlFor = questionModel.id.toString();
      label.textContent = q.answer;
      answer.appendChild(label);
      answer.appendChild(input);

      answerList.appendChild(answer);
    });
    const form = document.createElement("form");

    form.appendChild(question);
    form.appendChild(answerList);
    this.appendChild(form);
  }
}
