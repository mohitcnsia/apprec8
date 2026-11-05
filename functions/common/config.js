const region = "us-central1";
// Cost guard (owner, 2026-11-05: "extremely cautious about costs"): maxInstances caps how many copies of a function
// can run at once, so a bug, a loop or someone spamming the app can't run up a big bill. 10 is plenty for today's
// users; raise it only when real traffic needs it.
const runtimeOptions = {
  memory: "256MB",
  timeoutSeconds: 60,
  maxInstances: 10,
};
const longRuntimeOptions = {
  memory: "512MB",
  timeoutSeconds: 300,
  maxInstances: 2,
};

// Admin HTTP endpoints (functions/api): only callers with Cloud IAM access (the owner's token) can call them.
// Written in code so a deploy can never make one public. Callables and triggers keep the plain options.
const adminRuntimeOptions = { ...runtimeOptions, invoker: "private" };
const adminLongRuntimeOptions = { ...longRuntimeOptions, invoker: "private" };

module.exports = {
  region,
  runtimeOptions,
  longRuntimeOptions,
  adminRuntimeOptions,
  adminLongRuntimeOptions,
};
