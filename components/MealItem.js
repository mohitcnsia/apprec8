import { Image, Pressable, StyleSheet, Text, View } from "react-native";

function MealItem({ title, imageUrl, duration, complexity, affordability }) {
  return (
    <View style={styles.mealItem}>
      <Pressable
        android_ripple={{ color: "#CCC" }}
        style={({ pressed }) => {
          pressed ? styles.buttonPressed : null;
        }}
      >
        <View>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.detailsItem}>{duration}m</Text>
          <Text style={styles.detailsItem}>{complexity}</Text>
          <Text style={styles.detailsItem}>{affordability}</Text>
        </View>
      </Pressable>
    </View>
  );
}

export default MealItem;

const styles = StyleSheet.create({
  mealItem: {
    margin: 16,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "white",
  },
  image: {
    width: "100%",
    height: "200",
  },
  title: {
    fontWeight: "800",
    fontSize: 20,
    textAlign: "center",
    margin: 8,
  },
  details: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    justifyContent: "center",
  },
  detailsItem: {
    marginHorizontal: 4,
  },
  buttonPressed: {
    opacity: 0.5,
  },
});
