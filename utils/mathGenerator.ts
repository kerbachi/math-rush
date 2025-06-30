import { Operation, MathProblem, OperationSettings } from '@/types/math';

export function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateProblem(
  operation: Operation, 
  operationSettings: OperationSettings
): MathProblem {
  let num1: number;
  let num2: number;
  let answer: number;
  
  const range = operationSettings[operation];
  
  switch (operation) {
    case 'addition':
      num1 = generateRandomNumber(range.min, range.max);
      num2 = generateRandomNumber(range.min, range.max);
      answer = num1 + num2;
      break;
      
    case 'subtraction':
      // Ensure positive results
      const maxForSub = Math.max(range.min + 1, range.max);
      num1 = generateRandomNumber(range.min + 1, maxForSub);
      num2 = generateRandomNumber(range.min, Math.min(num1, range.max));
      answer = num1 - num2;
      break;
      
    case 'multiplication':
      num1 = generateRandomNumber(range.min, range.max);
      num2 = generateRandomNumber(range.min, range.max);
      answer = num1 * num2;
      break;
      
    case 'division':
      // Generate division problems that result in whole numbers
      num2 = generateRandomNumber(Math.max(1, range.min), range.max); // Avoid division by zero
      const quotient = generateRandomNumber(range.min, range.max);
      num1 = num2 * quotient;
      answer = quotient;
      break;
      
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
  
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    operation,
    num1,
    num2,
    answer
  };
}

export function getOperationSymbol(operation: Operation): string {
  switch (operation) {
    case 'addition': return '+';
    case 'subtraction': return '-';
    case 'multiplication': return '×';
    case 'division': return '÷';
    default: return '';
  }
}

export function generateProblemsSet(
  operations: Operation[], 
  count: number = 20, 
  operationSettings: OperationSettings
): MathProblem[] {
  const problems: MathProblem[] = [];
  const problemStrings = new Set<string>(); // To avoid duplicates
  
  while (problems.length < count) {
    const randomOperation = operations[Math.floor(Math.random() * operations.length)];
    const problem = generateProblem(randomOperation, operationSettings);
    const problemString = `${problem.num1}${getOperationSymbol(problem.operation)}${problem.num2}`;
    
    if (!problemStrings.has(problemString)) {
      problemStrings.add(problemString);
      problems.push(problem);
    }
  }
  
  return problems;
}