const Joi = require('joi');
const { getUserContextByEmail } = require('../ai/userProfileService');
const { createMedicalChatState, medicalAgentTurn } = require('../ai/medicalAgent');
const DatabaseService = require('../services/database.service');

const chatSchema = Joi.object({
  email: Joi.string().email().required(),
  message: Joi.string().min(1).required(),
});

const sessions = new Map();

function getSessionKey(email) {
  return email.toLowerCase().trim();
}

async function getOrCreateSession(email) {
  const key = getSessionKey(email);

  if (sessions.has(key)) {
    return sessions.get(key);
  }

  const userContext = await getUserContextByEmail(email);
  const chatState = createMedicalChatState(userContext);
  const session = { chatState, userContext };
  sessions.set(key, session);
  return session;
}

async function saveCompletedSession(email, chatState, userContext, finalDiagnosis) {
  const sessionsCollection = await DatabaseService.goToCollection('Sessions');
  const usersCollection = await DatabaseService.goToCollection('Users');
  const user = await usersCollection.findOne({ email }, { projection: { partnerToken: 1 } });

  await sessionsCollection.insertOne({
    patientEmail: email,
    partnerToken: user?.partnerToken || null,
    chiefComplaint: chatState.chiefComplaint,
    messages: chatState.messages,
    finalDiagnosis,
    userProfile: userContext,
    completedAt: new Date().toISOString(),
    summary: null,
  });
}

const AiController = {
  chat: async (req, res) => {
    try {
      const { error, value } = chatSchema.validate(req.body);
      if (error) {
        return res.status(400).send({ error: error.details[0].message });
      }

      const session = await getOrCreateSession(value.email);
      const result = await medicalAgentTurn(session.chatState, value.message);

      if (result.isFinal) {
        await saveCompletedSession(
          value.email,
          session.chatState,
          session.userContext,
          result.reply
        );
        sessions.delete(getSessionKey(value.email));
      }

      return res.status(200).json({
        reply: result.reply,
        isFinal: result.isFinal,
      });
    } catch (err) {
      console.error('AI chat failed:', err);
      return res.status(500).send({ error: 'Failed to process medical chat' });
    }
  },

  reset: async (req, res) => {
    try {
      const email = String(req.body?.email || '').trim().toLowerCase();
      if (!email) {
        return res.status(400).send({ error: 'Email is required' });
      }

      sessions.delete(getSessionKey(email));
      return res.status(200).json({ message: 'Chat reset' });
    } catch (err) {
      console.error('AI reset failed:', err);
      return res.status(500).send({ error: 'Failed to reset chat' });
    }
  },
};

module.exports = AiController;