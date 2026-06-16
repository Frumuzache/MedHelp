const { buildTranscript, generateSessionSummary } = require('../summaryAgent');

describe('buildTranscript', () => {
  it('formats user and assistant messages correctly', () => {
    const messages = [
      { role: 'user', content: 'I have a headache' },
      { role: 'assistant', content: 'Do you have a fever?' },
      { role: 'user', content: 'No' },
    ];
    const result = buildTranscript(messages);
    expect(result).toBe('Patient: I have a headache\nAI: Do you have a fever?\nPatient: No');
  });

  it('filters out system messages', () => {
    const messages = [
      { role: 'system', content: 'You are a triage assistant.' },
      { role: 'user', content: 'headache' },
      { role: 'assistant', content: 'Since when?' },
    ];
    const result = buildTranscript(messages);
    expect(result).not.toContain('system');
    expect(result).not.toContain('You are a triage assistant');
  });

  it('returns empty string for empty message list', () => {
    expect(buildTranscript([])).toBe('');
  });

  it('returns empty string when only system messages exist', () => {
    const messages = [{ role: 'system', content: 'prompt' }];
    expect(buildTranscript(messages)).toBe('');
  });
});

describe('generateSessionSummary', () => {
  const mockSummary = `CHIEF COMPLAINT: Headache
SYMPTOMS REPORTED: headache, nausea
SYMPTOMS DENIED: fever
AI TRIAGE ASSESSMENT: Tension headache
URGENCY LEVEL: MEDIUM
MEDICATION SUGGESTIONS: Ibuprofen
EMERGENCY CONSULT RECOMMENDED: NO
CLINICAL NOTES: None`;

  beforeEach(() => {
    jest.mock('../ollamaClient', () => ({
      chatWithOllama: jest.fn().mockResolvedValue(mockSummary),
    }));
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('calls chatWithOllama and returns its response', async () => {
    jest.isolateModules(async () => {
      jest.mock('../ollamaClient', () => ({
        chatWithOllama: jest.fn().mockResolvedValue(mockSummary),
      }));
      const { generateSessionSummary: gen } = require('../summaryAgent');
      const result = await gen({
        messages: [{ role: 'user', content: 'headache' }],
        userProfile: 'Age: 30',
        finalDiagnosis: 'FINAL DIAGNOSIS: Tension headache',
      });
      expect(result).toBe(mockSummary);
    });
  });
});
