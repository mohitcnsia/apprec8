const region = "us-central1";
const runtimeOptions = {
  memory: "256MB",
  timeoutSeconds: 60,
};
const longRuntimeOptions = {
  memory: "512MB",
  timeoutSeconds: 300,
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
