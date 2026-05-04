const { chatWithOllama } = require('./ollamaClient');
const { buildSystemPrompt } = require('./systemPrompt');

function createMedicalChatState(userContext = '') {
  return [{ role: 'system', content: buildSystemPrompt(userContext) }];
}

function isFinalResponse(content) {
  return content.trim().toUpperCase().startsWith('FINAL DIAGNOSIS:');
}

async function medicalAgentTurn(chatState, userInput) {
  chatState.push({ role: 'user', content: userInput });
  const reply = await chatWithOllama({ messages: chatState });
  chatState.push({ role: 'assistant', content: reply });

  return {
    reply,
    isFinal: isFinalResponse(reply),
  };
}

module.exports = {
  createMedicalChatState,
  medicalAgentTurn,
};
