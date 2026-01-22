import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Colors } from "../../constants/Colors";

function CustomTabBarButton({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress?: any;
}) {
  return (
    <TouchableOpacity
      style={{
        top: -30,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
      }}
      onPress={onPress}
    >
      <View
        style={{
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: Colors.primary,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 4,
          borderColor: Colors.background,
        }}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: -5,
          marginBottom: 5,
        },
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 16,
          right: 16,
          elevation: 0,
          backgroundColor: Colors.card, // Floating island color
          borderRadius: 24,
          height: 70,
          borderTopWidth: 0,
          // Border styling for the island
          borderWidth: 1,
          borderColor: Colors.border,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.25,
          shadowRadius: 10,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.tabIconDefault,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Feed",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "compass" : "compass-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* Center FAB - Redirects to Scan via custom button, or just matches existing route */}
      <Tabs.Screen
        name="scan/index"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <Ionicons name="add" size={32} color="#FFF" />
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton {...props}>
              <Ionicons name="add" size={32} color="#FFF" />
            </CustomTabBarButton>
          ),
        }}
      />

      <Tabs.Screen
        name="hub"
        options={{
          title: "AI Hub",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "sparkles" : "sparkles-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* Hidden Tabs */}
      <Tabs.Screen
        name="favorites"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="scan/results"
        options={{
          href: null,
          tabBarStyle: { display: "none" }, // Hide tab bar on results screen? Or generic stack behavior
        }}
      />
    </Tabs>
  );
}
