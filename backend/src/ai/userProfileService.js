const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const DatabaseService = require('../services/database.service');

const DEFAULT_COLLECTION = process.env.USERS_COLLECTION || 'users';

function safeString(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return '';
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return '';
  const diffMs = Date.now() - dob.getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function buildUserContext(user) {
  if (!user) return '';

  const age = calculateAge(user.dateOfBirth);
  const sex = safeString(user.sex);
  const weight = safeString(user.weight);
  const height = safeString(user.height);
  const country = safeString(user.country);
  const previousConditions = safeString(user.previousConditions || user.previous_conditions);
  const familyConditions = safeString(user.familyConditions || user.family_conditions);

  const lines = [];

  if (age) lines.push(`Age: ${age}`);
  if (sex) lines.push(`Sex: ${sex}`);
  if (weight) lines.push(`Weight: ${weight} kg`);
  if (height) lines.push(`Height: ${height} cm`);
  if (country) lines.push(`Country: ${country}`);
  if (previousConditions) lines.push(`Previous conditions: ${previousConditions}`);
  if (familyConditions) lines.push(`Family conditions: ${familyConditions}`);

  return lines.length ? lines.join('\n') : '';
}

async function getUserByEmail(email) {
  const collection = await DatabaseService.goToCollection(DEFAULT_COLLECTION);
  return collection.findOne({ email });
}

async function getUserContextByEmail(email) {
  if (!email) return '';
  const user = await getUserByEmail(email);
  return buildUserContext(user);
}

module.exports = {
  getUserContextByEmail,
  buildUserContext,
};
