// utils/ttlCache.js: a small in-memory cache with a freshness window (owner, 2026-11-10: Progress tabs must open fast
// and not re-read every child on each switch). Pure: the fetcher is passed in, so it is tested without Firestore.

export function makeTtlCache({ freshMs = 10 * 60 * 1000 } = {}) {
  const store = new Map(); // key → { data, at }
  const inflight = new Map(); // key → Promise (two screens asking at once share one read)
  return {
    /** The cached value (even if old), or undefined. For drawing a screen at once. */
    peek(key) {
      return store.get(key)?.data;
    },
    /** Fresh cached value, or fetch once (force = always fetch). */
    async get(key, fetcher, { force = false, now = Date.now() } = {}) {
      const hit = store.get(key);
      if (hit && !force && now - hit.at < freshMs) return hit.data;
      if (inflight.has(key)) return inflight.get(key);
      const p = (async () => {
        try {
          const data = await fetcher();
          store.set(key, { data, at: now });
          return data;
        } finally {
          inflight.delete(key);
        }
      })();
      inflight.set(key, p);
      return p;
    },
    clear() {
      store.clear();
    },
    size() {
      return store.size;
    },
  };
}
