import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
    return (
        <SafeAreaView className="flex-1 bg-primary-950">
            <View className="flex-1 items-center justify-center px-6">
                {/* Logo Placeholder */}
                <View className="w-24 h-24 bg-primary-500 rounded-full items-center justify-center mb-8">
                    <Text className="text-white text-4xl">👗</Text>
                </View>

                {/* Title */}
                <Text className="text-white text-3xl font-bold text-center mb-2">
                    Outfit App
                </Text>
                <Text className="text-primary-200 text-lg text-center mb-12">
                    Your AI-powered wardrobe assistant
                </Text>

                {/* Buttons */}
                <Link href="/(auth)/register" asChild>
                    <Pressable className="w-full bg-primary-500 py-4 rounded-xl mb-4">
                        <Text className="text-white text-center font-semibold text-lg">
                            Get Started
                        </Text>
                    </Pressable>
                </Link>

                <Link href="/(auth)/login" asChild>
                    <Pressable className="w-full border border-primary-400 py-4 rounded-xl">
                        <Text className="text-primary-200 text-center font-semibold text-lg">
                            I already have an account
                        </Text>
                    </Pressable>
                </Link>
            </View>
        </SafeAreaView>
    );
}
