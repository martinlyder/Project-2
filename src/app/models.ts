export interface Message {
  content: string;
  isUser: boolean;
}

export interface Model {
  id: any;
  name: any;
  parameters?: Record<string, any>;
}

export const AVAILABLE_MODELS: Model[] = [
  {
    id: "meta/llama-3-8b-instruct",
    name: "Meta Llama 3 8B Instruct",
    parameters: {
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 500,
      presence_penalty: 1.15
    }
  },
  {
    id: "meta/llama-3-70b-instruct",
    name: "Meta Llama 3 70B Instruct",
    parameters: {
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 500,
      presence_penalty: 1.15
    }
  },
  {
    id: "anthropic/claude-3-sonnet",
    name: "Anthropic Claude 3.7 Sonnet",
    parameters: {
      temperature: 0.7,
      max_tokens: 500
    }
  },
  {
    id: "deepseek-ai/deepseek-r1",
    name: "DeepSeek R1",
    parameters: {
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 500
    }
  },
  {
    id: "google/flan-t5-xl",
    name: "Flan-T5 XL",
    parameters: {
      temperature: 0.7,
      max_tokens: 500
    }
  }
];