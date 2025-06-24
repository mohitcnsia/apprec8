import { Text, TouchableOpacity, View } from "react-native";
import Svg, { Polygon } from "react-native-svg";

const HexButton = ({
  letter,
  onPress,
  isCenter,
  size,
  backgroundColor,
  borderColor,
  textColor,
}) => {
  const safeStrokeWidth = 2;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View
        style={{
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Svg
          height={size}
          width={size}
          viewBox="0 0 110 110" // 🔧 Slightly larger viewbox to avoid stroke cutoff
        >
          <Polygon
            points="55,5 100,30 100,80 55,105 10,80 10,30"
            fill={backgroundColor}
            stroke={borderColor}
            strokeWidth={safeStrokeWidth}
            strokeLinejoin="round"
          />
        </Svg>
        <Text
          style={{
            position: "absolute",
            top: "35%",
            alignSelf: "center",
            fontSize: 18,
            fontWeight: "bold",
            color: textColor,
          }}
        >
          {letter}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default HexButton;
