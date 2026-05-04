const readline = require('readline');
const { createMedicalChatState, medicalAgentTurn } = require('./medicalAgent');
const { getUserContextByEmail } = require('./userProfileService');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let chatState = createMedicalChatState();
let userContext = '';

function promptUser() {
  rl.question('You: ', async (input) => {
    const trimmed = input.trim();

    if (trimmed.toLowerCase() === '/exit') {
      rl.close();
      return;
    }

    if (trimmed.toLowerCase() === '/reset') {
      chatState = createMedicalChatState(userContext);
      console.log('Assistant: Session reset. Describe your issue.');
      return promptUser();
    }

    if (!trimmed) {
      return promptUser();
    }

    try {
      const { reply, isFinal } = await medicalAgentTurn(chatState, trimmed);
      console.log(`Assistant: ${reply}`);

      if (isFinal) {
        console.log('Assistant: You can type /reset to start over or /exit to quit.');
      }
    } catch (err) {
      console.error('Assistant: Error talking to the model:', err.message);
    }

    promptUser();
  });
}

rl.question('Email (optional, press Enter to skip): ', async (emailInput) => {
  const email = emailInput.trim();
  if (email) {
    try {
      userContext = await getUserContextByEmail(email);
      if (!userContext) {
        console.log('Assistant: No profile found for that email. Continuing without profile context.');
      }
    } catch (err) {
      console.error('Assistant: Failed to load profile context:', err.message);
    }
  }

  chatState = createMedicalChatState(userContext);
  console.log('Assistant: Describe your issue. Type /reset to start over or /exit to quit.');
  promptUser();
});
