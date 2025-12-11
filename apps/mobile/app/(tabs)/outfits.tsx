import { View, Text, StyleSheet } from "react-native";
import { SafeView } from "../../components/SafeView";

export default function OutfitsScreen() {
    return (
        <SafeView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Outfits</Text>
                <Text style={styles.subtitle}>Sprint 6 - Coming soon</Text>
            </View>
        </SafeView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        marginTop: 8,
    },
});
