import { normalizeText } from './sanitize.js';

export const MAX_COMMENTS_LENGTH = 200;
export const MAX_ADDRESS_LENGTH = 150;

export const limitText = (value, maxLength) => normalizeText(value).slice(0, maxLength);

export const validateRequiredText = (value, maxLength, fieldLabel) => {
  const normalized = normalizeText(value);
  if (!normalized) {
    return { valid: false, value: '', error: `${fieldLabel} es obligatoria.` };
  }
  if (normalized.length > maxLength) {
    return {
      valid: false,
      value: normalized.slice(0, maxLength),
      error: `${fieldLabel} no puede superar ${maxLength} caracteres.`,
    };
  }
  return { valid: true, value: normalized, error: '' };
};

export const validateOptionalText = (value, maxLength, fieldLabel) => {
  const normalized = normalizeText(value);
  if (!normalized) {
    return { valid: true, value: '', error: '' };
  }
  if (normalized.length > maxLength) {
    return {
      valid: false,
      value: normalized.slice(0, maxLength),
      error: `${fieldLabel} no puede superar ${maxLength} caracteres.`,
    };
  }
  return { valid: true, value: normalized, error: '' };
};
