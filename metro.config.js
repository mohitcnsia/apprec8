// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be adjusted eg: path.resolve(projectRoot, '..')
// const workspaceRoot = path.resolve(projectRoot, '../..'); // Uncomment if in a monorepo

const config = getDefaultConfig(projectRoot);

// --- ADD YOUR CUSTOMIZATIONS HERE ---
// Example: Enable SVG support
// const { transformer, resolver } = config;
// config.transformer = {
//   ...transformer,
//   babelTransformerPath: require.resolve('react-native-svg-transformer'),
// };
// config.resolver = {
//   ...resolver,
//   assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
//   sourceExts: [...resolver.sourceExts, 'svg'],
// };

// Example: Add workspace roots if in a monorepo
// config.watchFolders = [workspaceRoot];
// config.resolver.nodeModulesPaths = [
//   path.resolve(projectRoot, 'node_modules'),
//   path.resolve(workspaceRoot, 'node_modules'),
// ];

// --- END CUSTOMIZATIONS ---

module.exports = config;
