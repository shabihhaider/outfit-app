import { View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SafeViewProps {
    children: React.ReactNode;
    style?: ViewStyle;
    edges?: ("top" | "bottom" | "left" | "right")[];
}

/**
 * NativeWind-compatible SafeAreaView replacement.
 * Uses useSafeAreaInsets hook instead of SafeAreaView component
 * to avoid type casting issues on Android with NativeWind.
 */
export function SafeView({ children, style, edges = ["top", "bottom", "left", "right"] }: SafeViewProps) {
    const insets = useSafeAreaInsets();

    const paddingStyle: ViewStyle = {
        paddingTop: edges.includes("top") ? insets.top : 0,
        paddingBottom: edges.includes("bottom") ? insets.bottom : 0,
        paddingLeft: edges.includes("left") ? insets.left : 0,
        paddingRight: edges.includes("right") ? insets.right : 0,
    };

    return (
        <View style={[{ flex: 1 }, paddingStyle, style]}>
            {children}
        </View>
    );
}
