const { chatWithOllama } = require('./ollamaClient');
const { buildSystemPrompt } = require('./systemPrompt');

const MAX_CONTEXT_MESSAGES = 7;
const MAX_MEMORY_ITEMS = 7;
const MIN_QUESTIONS_BEFORE_DIAGNOSIS = 4;
const MAX_QUESTIONS_BEFORE_DIAGNOSIS = 6;

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function createMedicalChatState(userContext = '') {
  return {
    userContext,
    chiefComplaint: '',
    memory: [],
    messages: [],
    questionCount: 0,
  };
}

function buildConversationMemory(chatState) {
  const sections = [];

  if (chatState.chiefComplaint) {
    sections.push(`Chief complaint: ${chatState.chiefComplaint}`);
  }

  if (chatState.memory.length) {
    sections.push('Recent user facts:');
    chatState.memory.forEach((entry, index) => {
      sections.push(`${index + 1}. ${entry}`);
    });
  }

  return sections.join('\n');
}

function addToConversationMemory(chatState, userInput) {
  const cleanInput = normalizeText(userInput);

  if (!cleanInput) {
    return;
  }

  if (!chatState.chiefComplaint) {
    chatState.chiefComplaint = cleanInput;
  }

  chatState.memory.push(cleanInput);
  if (chatState.memory.length > MAX_MEMORY_ITEMS) {
    chatState.memory = chatState.memory.slice(-MAX_MEMORY_ITEMS);
  }
}

function getRecentMessages(chatState) {
  return chatState.messages.slice(-MAX_CONTEXT_MESSAGES);
}

function isFinalResponse(content) {
  return content.trim().toUpperCase().startsWith('FINAL DIAGNOSIS:');
}

function buildMessages(chatState) {
  return [
    {
      role: 'system',
      content: buildSystemPrompt(
        chatState.userContext,
        buildConversationMemory(chatState),
        chatState.questionCount,
      ),
    },
    ...getRecentMessages(chatState),
  ];
}

async function askOllama(chatState) {
  return chatWithOllama({ messages: buildMessages(chatState) });
}

async function retryWithConstraint(chatState, constraintMessage) {
  const constrainedState = {
    ...chatState,
    messages: [
      ...chatState.messages,
      { role: 'system', content: constraintMessage },
    ],
  };

  return askOllama(constrainedState);
}

async function medicalAgentTurn(chatState, userInput) {
  const cleanInput = normalizeText(userInput);

  if (!cleanInput) {
    throw new Error('User input is required');
  }

  addToConversationMemory(chatState, cleanInput);
  chatState.messages.push({ role: 'user', content: cleanInput });

  // If we've already reached the maximum allowed questions, inject a
  // one-off system constraint into the outgoing messages so the model
  // returns a final diagnosis instead of asking another question.
  let constraint = null;
  if (chatState.questionCount >= MAX_QUESTIONS_BEFORE_DIAGNOSIS) {
    constraint = `You have reached the maximum of ${MAX_QUESTIONS_BEFORE_DIAGNOSIS} questions. Do not ask another question. Provide FINAL DIAGNOSIS now, with a brief safety disclaimer.`;
  }

  let reply;
  if (constraint) {
    const msgs = [
      ...buildMessages(chatState),
      { role: 'system', content: constraint },
    ];
    reply = await chatWithOllama({ messages: msgs });
  } else {
    reply = await askOllama(chatState);
  }

  let isFinal = isFinalResponse(reply);

  chatState.messages.push({ role: 'assistant', content: reply });
  if (chatState.messages.length > MAX_CONTEXT_MESSAGES) {
    chatState.messages = chatState.messages.slice(-MAX_CONTEXT_MESSAGES);
  }

  if (!isFinal) {
    chatState.questionCount += 1;
  }

  return {
    reply,
    isFinal: isFinalResponse(reply),
  };
}

module.exports = {
  createMedicalChatState,
  medicalAgentTurn,
};
