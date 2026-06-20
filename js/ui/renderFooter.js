import { escapeHtml } from '../security/sanitize.js';

export const renderFooter = ({ text }) => `
  <footer class="text-center py-6 px-4 text-xs text-textSecondary border-t border-primary/20">
    <p>${escapeHtml(text)}</p>
  </footer>
`;
