const { chatWithOllama } = require('./ollamaClient');

const SUMMARY_SYSTEM_PROMPT = `You are a clinical assistant summarizing a patient AI triage session for a doctor.
Analyze the conversation transcript and patient profile, then output a structured report in EXACTLY this format with no extra text:

CHIEF COMPLAINT: <one sentence describin<g the main symptom>
SYMPTOMS REPORTED: <comma-separated list of symptoms the patient confirmed>
SYMPTOMS DENIED: <comma-separated list of symptoms the patient denied>
AI TRIAGE ASSESSMENT: <one short paragraph with the triage conclusion>
URGENCY LEVEL: <one of: LOW, MEDIUM, HIGH, EMERGENCY>
MEDICATION SUGGESTIONS: <suggested OTC or prescription medications, or "None at this time">
EMERGENCY CONSULT RECOMMENDED: <YES or NO>
CLINICAL NOTES: <any additional observations relevant to the doctor>

Be concise and clinically precise. Do not add anything outside this format.`;

function buildTranscript(messages) {
  return messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => `${m.role === 'user' ? 'Patient' : 'AI'}: ${m.content}`)
    .join('\n');
}

async function generateSessionSummary({ messages, userProfile, finalDiagnosis }) {
  const transcript = buildTranscript(messages);

  const userMessage = [
    'Patient Profile:',
    userProfile || 'No profile data available.',
    '',
    'Triage Transcript:',
    transcript,
    '',
    'AI Final Diagnosis:',
    finalDiagnosis,
    '',
    'Generate the structured clinical summary.',
  ].join('\n');

  return chatWithOllama({
    messages: [
      { role: 'system', content: SUMMARY_SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.1,
    topP: 0.7,
  });
}

module.exports = { generateSessionSummary };