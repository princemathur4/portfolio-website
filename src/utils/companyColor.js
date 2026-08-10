/**
 * Fixed brand color per employer, keyed by the experience entry's `id`.
 * Deliberately not derived from getSkillColor's hash palette — these need
 * to match specific company branding, not just be visually distinct.
 */
const COMPANY_COLORS = {
  checkmate: "#E85D9C", // pink
  scaler: "#007bc9", // blue
  egregore: "#00B250", // green
  redcarpetup: "#E8623D", // reddish orange
  cetpa: "#22B8D8", // cyan
};

const FALLBACK_COLOR = "#59C3B4";

export function getCompanyColor(jobId) {
  return COMPANY_COLORS[jobId] || FALLBACK_COLOR;
}
