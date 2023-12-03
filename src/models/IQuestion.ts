import { IAnswer } from "./IAnswer";

export interface IQuestion {
    id:number;
    question:string;
    answers: IAnswer[];
}