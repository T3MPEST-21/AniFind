import { Text, View } from "react-native";
import { GlobalStyles } from "../../constants/Styles";

export default function FavoritesScreen() {
  return (
    <View
      style={[
        GlobalStyles.container,
        { justifyContent: "center", alignItems: "center" },
      ]}
    >
      <Text style={GlobalStyles.title}>Favorites Screen</Text>
    </View>
  );
}
