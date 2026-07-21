const OpenAI = require("openai");
const config = require("../../config");

// Keeps token-by-token streaming isolated from Express/HTTP concerns so it's
// easy to swap providers later. Points at Groq's OpenAI-compatible endpoint.
const client = new OpenAI({
  apiKey: config.openai.apiKey,
  baseURL: "https://api.groq.com/openai/v1",
});

async function* streamCompletion(history, options) {
  const messages = options.systemPrompt
    ? [{ role: "system", content: options.systemPrompt }, ...history]
    : history;

  const stream = await client.chat.completions.create({
    model: options.model,
    temperature: options.temperature,
    max_tokens: options.maxTokens,
    messages,
    stream: true,
  });

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content;
    if (token) yield token;
  }
}

module.exports = { streamCompletion };
