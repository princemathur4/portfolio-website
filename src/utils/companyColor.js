/**
 * Fixed brand color per employer, keyed by the experience entry's `id`.
 * Deliberately not derived from getSkillColor's hash palette — these need
 * to match specific company branding, not just be visually distinct.
 */
const COMPANY_COLORS = {
  checkmate: "#E85D9C", // pink
  scaler: "#3E7BFA", // blue
  egregore: "#2F7D52", // darkish green
  redcarpetup: "#E8623D", // reddish orange
  cetpa: "#B5D63B", // lemon green
};

const FALLBACK_COLOR = "#59C3B4";

export function getCompanyColor(jobId) {
  return COMPANY_COLORS[jobId] || FALLBACK_COLOR;
}
