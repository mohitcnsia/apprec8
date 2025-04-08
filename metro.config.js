// metro.config.js
const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);

// --- START OF ADDED CODE ---

// List of font filenames we want to BLOCK (because we only use Ionicons and MaterialIcons)
const unusedFontFilenames = [
  "AntDesign.ttf",
  "Entypo.ttf",
  "EvilIcons.ttf",
  "Feather.ttf",
  "FontAwesome.ttf",
  "FontAwesome5_Brands.ttf",
  "FontAwesome5_Regular.ttf",
  "FontAwesome5_Solid.ttf",
  "FontAwesome6_Brands.ttf",
  "FontAwesome6_Regular.ttf",
  "FontAwesome6_Solid.ttf",
  "Fontisto.ttf",
  "Foundation.ttf",
  "MaterialCommunityIcons.ttf", // The big 1.15MB file we don't use
  "Octicons.ttf",
  "SimpleLineIcons.ttf",
  "Zocial.ttf",
];

// Create regular expression patterns to block these files specifically within the vector-icons path
// This looks for paths ending like ".../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/AntDesign.ttf"
// We escape the dot (.) in the filename to treat it literally.
const blockListPatterns = unusedFontFilenames.map(
  (filename) =>
    new RegExp(
      `node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/${filename.replace(
        /\./g,
        "\\."
      )}$`
    )
);

// Ensure the resolver and blockList exist, then add our patterns
config.resolver = config.resolver || {};
// config.resolver.blockList = config.resolver.blockList
//   ? Array.isArray(config.resolver.blockList)
//     ? [...config.resolver.blockList, ...blockListPatterns] // Add to existing array
//     : [config.resolver.blockList, ...blockListPatterns] // Wrap existing non-array blockList
//   : blockListPatterns; // Create blockList if it doesn't exist

// --- END OF ADDED CODE ---

module.exports = config;
