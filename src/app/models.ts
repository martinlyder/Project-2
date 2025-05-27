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
    id: "meta/meta-llama-3-8b-instruct",
    name: "An 8 billion parameter language model from Meta, fine tuned for chat",
    parameters: {
     top_k: 0,
     top_p: 0.9,
     max_tokens: 512,
     min_tokens: 0,
     temperature: 0.6,
     system_prompt: "You are a helpful assistant, who answers in the same language as you are asked",
     length_penalty: 1,
     stop_sequences: "<|end_of_text|>,<|eot_id|>",
     prompt_template: "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nYou are a helpful assistant, who answers in the same language as you are asked<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
     presence_penalty: 1.15,
     log_performance_metrics: false
    }
  },
  {
    id: "meta/meta-llama-3-70b-instruct",
    name: "A 70 billion parameter language model from Meta, fine tuned for chat completions",
    parameters: {
     top_k: 0,
     top_p: 0.9,
     max_tokens: 512,
     min_tokens: 0,
     temperature: 0.6,
     system_prompt: "You are a helpful assistant, who answers in the same language as you are asked",
     length_penalty: 1,
     stop_sequences: "<|end_of_text|>,<|eot_id|>",
     prompt_template: "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nYou are a helpful assistant, who answers in the same language as you are asked<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
     presence_penalty: 1.15,
     log_performance_metrics: false
    }
  },
  {
    id: "anthropic/claude-3.5-haiku",
    name: "Anthropic's fastest, most cost-effective model, with a 200K token context",
    parameters: {
      max_tokens: 8192,
      system_prompt: "You are a helpful assistant, who answers in the same language as you are asked"
    }
  },
  {
    id: "anthropic/claude-3.7-sonnet",
    name: "The most intelligent Claude model and the first hybrid reasoning model",
    parameters: {
       max_tokens: 8192,
       system_prompt: "",
       max_image_resolution: 0.5
    }
  },
  {
    id: "google-deepmind/gemma-7b-it:2790a695e5dcae15506138cc4718d1106d0d475e6dca4b1d43f42414647993d5",
    name: "7B instruct version of Google’s Gemma model",
    parameters: {
     top_k: 50,
     top_p: 0.95,
     temperature: 0.7,
     max_new_tokens: 512,
     min_new_tokens: -1,
     repetition_penalty: 1
    }
  }
];