export interface AIInput {
  prompt: string;
  userInput: Record<string, any>;
}

export interface AIOutput {
  rawText: string;
  structured?: any;
}

export interface AIProvider {
  generate(input: AIInput): Promise<AIOutput>;
}
