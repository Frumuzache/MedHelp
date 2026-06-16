const {
  normalizeText,
  isFinalResponse,
  createMedicalChatState,
  buildConversationMemory,
  addToConversationMemory,
} = require('../medicalAgent');

describe('normalizeText', () => {
  it('trims leading and trailing whitespace', () => {
    expect(normalizeText('  headache  ')).toBe('headache');
  });

  it('collapses multiple spaces into one', () => {
    expect(normalizeText('chest   pain')).toBe('chest pain');
  });

  it('returns empty string for null', () => {
    expect(normalizeText(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(normalizeText(undefined)).toBe('');
  });

  it('converts numbers to strings', () => {
    expect(normalizeText(42)).toBe('42');
  });
});

describe('isFinalResponse', () => {
  it('returns true when reply starts with FINAL DIAGNOSIS:', () => {
    expect(isFinalResponse('FINAL DIAGNOSIS: You have a cold.')).toBe(true);
  });

  it('returns true when there is leading whitespace before FINAL DIAGNOSIS', () => {
    expect(isFinalResponse('  FINAL DIAGNOSIS: migraine')).toBe(true);
  });

  it('returns false for a regular question', () => {
    expect(isFinalResponse('Do you have a fever?')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isFinalResponse('')).toBe(false);
  });

  it('matches regardless of case because the function uppercases internally', () => {
    expect(isFinalResponse('final diagnosis: something')).toBe(true);
  });
});

describe('createMedicalChatState', () => {
  it('returns a state object with the correct shape', () => {
    const state = createMedicalChatState('Age: 30');
    expect(state).toEqual({
      userContext: 'Age: 30',
      chiefComplaint: '',
      memory: [],
      messages: [],
      questionCount: 0,
    });
  });

  it('defaults userContext to empty string when not provided', () => {
    const state = createMedicalChatState();
    expect(state.userContext).toBe('');
  });
});

describe('buildConversationMemory', () => {
  it('returns empty string when no complaint or memory', () => {
    const state = createMedicalChatState();
    expect(buildConversationMemory(state)).toBe('');
  });

  it('includes chief complaint when set', () => {
    const state = createMedicalChatState();
    state.chiefComplaint = 'headache';
    expect(buildConversationMemory(state)).toContain('Chief complaint: headache');
  });

  it('lists memory entries', () => {
    const state = createMedicalChatState();
    state.chiefComplaint = 'headache';
    state.memory = ['headache', 'no fever'];
    const result = buildConversationMemory(state);
    expect(result).toContain('1. headache');
    expect(result).toContain('2. no fever');
  });
});

describe('addToConversationMemory', () => {
  it('sets the chief complaint on the first call', () => {
    const state = createMedicalChatState();
    addToConversationMemory(state, 'headache for 3 days');
    expect(state.chiefComplaint).toBe('headache for 3 days');
  });

  it('does not overwrite the chief complaint on subsequent calls', () => {
    const state = createMedicalChatState();
    addToConversationMemory(state, 'headache');
    addToConversationMemory(state, 'nausea');
    expect(state.chiefComplaint).toBe('headache');
  });

  it('does nothing for empty input', () => {
    const state = createMedicalChatState();
    addToConversationMemory(state, '   ');
    expect(state.chiefComplaint).toBe('');
    expect(state.memory).toHaveLength(0);
  });

  it('trims memory to the last 7 entries', () => {
    const state = createMedicalChatState();
    for (let i = 1; i <= 9; i++) {
      addToConversationMemory(state, `symptom ${i}`);
    }
    expect(state.memory).toHaveLength(7);
    expect(state.memory[0]).toBe('symptom 3');
    expect(state.memory[6]).toBe('symptom 9');
  });
});
