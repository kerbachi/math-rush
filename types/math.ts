export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';

export interface NumberRange {
  min: number;
  max: number;
}

export interface OperationSettings {
  addition: NumberRange;
  subtraction: NumberRange;
  multiplication: NumberRange;
  division: NumberRange;
}

export interface MathProblem {
  id: string;
  operation: Operation;
  num1: number;
  num2: number;
  answer: number;
  userAnswer?: number;
  isCorrect?: boolean;
}

export interface GameSession {
  problems: MathProblem[];
  selectedOperations: Operation[];
  totalTime: number;
  currentProblemIndex: number;
  score: number;
  isActive: boolean;
  isComplete: boolean;
}

export interface HighScore {
  id: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  operations: Operation[];
  date: string;
  testDuration: number; // Duration in seconds
}

export interface UserSettings {
  selectedOperations: Operation[];
  soundEnabled: boolean;
  operationSettings: OperationSettings;
  testDuration: number; // Duration in seconds (5-300)
}