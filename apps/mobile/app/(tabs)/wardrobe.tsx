import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WardrobeScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 items-center justify-center">
                <Text className="text-2xl font-bold text-gray-800">Wardrobe</Text>
                <Text className="text-gray-500 mt-2">Sprint 5 - Coming soon</Text>
            </View>
        </SafeAreaView>
    );
}
