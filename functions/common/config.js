const region = "us-central1";
const runtimeOptions = {
  memory: "256MB",
  timeoutSeconds: 60,
};
const longRuntimeOptions = {
  memory: "512MB",
  timeoutSeconds: 300,
};

module.exports = {
  region,
  runtimeOptions,
  longRuntimeOptions,
};
