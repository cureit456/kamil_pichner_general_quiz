export type Seconds = number;

export type TimerData = {
  [questionsId: string]: Seconds;
};

export class TimerTool {
  public static readonly TIME_STORAGE_KEY: string = "timeStatistics";

  private _seconds: number = 0;
  private _count: number = 1;
  private _countdown: number = 0;
  private _questionId: string = "-1";

  constructor() {
    const timerData: TimerData = {};

    localStorage.setItem(TimerTool.TIME_STORAGE_KEY, JSON.stringify(timerData));
  }

  public startMeasurement(questionId: string): void {
    if (this._questionId != "-1" && this._questionId != questionId) {
      this.endMeasurement();
    }

    this._questionId = questionId;

    this._count = 1;
    this._countdown = setInterval(() => {
      this._seconds = this._count % 60;

      this._count++;
    }, 1000);
  }
  private endMeasurement(): void {
    clearInterval(this._countdown);

    const timerData: TimerData = JSON.parse(
      localStorage.getItem(TimerTool.TIME_STORAGE_KEY) as string
    ) as TimerData;

    timerData[this._questionId] = !timerData[this._questionId]
      ? (timerData[this._questionId] = this._seconds)
      : (timerData[this._questionId] += this._seconds);

    localStorage.setItem(TimerTool.TIME_STORAGE_KEY, JSON.stringify(timerData));

    this._count = 0;
    this._seconds = 0;
  }
}
