const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'cniongolo/biomistral';

async function chatWithOllama({
  messages,
  model = DEFAULT_MODEL,
  temperature = 0.2,
  topP = 0.9,
}) {
  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      top_p: topP,
      stream: false,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama error ${response.status}: ${text}`);
  }

  const data = await response.json();
  if (!data?.message?.content) {
    throw new Error('Invalid Ollama response: missing message content');
  }

  return data.message.content;
}

module.exports = {
  chatWithOllama,
};
