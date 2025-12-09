import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 items-center justify-center">
                <Text className="text-2xl font-bold text-gray-800">Login Screen</Text>
                <Text className="text-gray-500 mt-2">To be implemented in Task 1.2</Text>
            </View>
        </SafeAreaView>
    );
}
