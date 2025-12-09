import { Tabs } from "expo-router";
import { View, Text } from "react-native";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#1e3a5f",
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => <Text style={{ color }}>🏠</Text>,
                }}
            />
            <Tabs.Screen
                name="wardrobe"
                options={{
                    title: "Wardrobe",
                    tabBarIcon: ({ color }) => <Text style={{ color }}>👕</Text>,
                }}
            />
            <Tabs.Screen
                name="outfits"
                options={{
                    title: "Outfits",
                    tabBarIcon: ({ color }) => <Text style={{ color }}>👗</Text>,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => <Text style={{ color }}>👤</Text>,
                }}
            />
        </Tabs>
    );
}
