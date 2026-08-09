/**
 * Search service (not wired up to a UI yet).
 *
 * This is the intended seam for the two future-scope items from the
 * project brief:
 *
 *   1. A Postgres ts-vector search endpoint returning ranked matches
 *      across experience/projects/skills content.
 *   2. A RAG-based "ask" endpoint that answers free-text questions about
 *      Prince's background, grounded in the same content.
 *
 * Suggested shape for either backend, so no component code has to
 * change when this stops being a stub:
 *
 *   searchContent(query) -> Promise<Array<{
 *     type: 'experience' | 'project' | 'skill',
 *     id: string,
 *     title: string,
 *     snippet: string,
 *     anchorId: string,
 *     score: number,
 *   }>>
 *
 *   askQuestion(question) -> Promise<{ answer: string, sources: Array<{ id, title, anchorId }> }>
 *
 * Once a backend exists, point API_BASE_URL at it and replace the
 * `throw` below with a real fetch call. Components should only ever
 * import from this file, never call the backend directly, so this stays
 * the one place that needs to change.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || null;

export async function searchContent(query) {
  if (!API_BASE_URL) {
    throw new Error(
      "searchContent() is not wired up yet. Set VITE_API_BASE_URL and implement the fetch call here once the Postgres ts-vector (or RAG) backend exists."
    );
  }
  const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error(`Search request failed: ${response.status}`);
  return response.json();
}

export async function askQuestion(question) {
  if (!API_BASE_URL) {
    throw new Error(
      "askQuestion() is not wired up yet. Set VITE_API_BASE_URL and implement the fetch call here once the RAG backend exists."
    );
  }
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!response.ok) throw new Error(`Ask request failed: ${response.status}`);
  return response.json();
}
