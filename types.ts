
export interface Question {
  text: string;
  options: string[];
  answer: number;
  note: string;
}

export enum QuizState {
  IDLE = 'idle',
  ACTIVE = 'active',
  FINISHED = 'finished',
}
