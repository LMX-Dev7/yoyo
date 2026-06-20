const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export const normalizeText = (value = '') => String(value ?? '')
  .replace(/\u0000/g, '')
  .replace(/\r\n?/g, '\n')
  .trim();

export const escapeHtml = (value = '') => normalizeText(value).replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char]);
