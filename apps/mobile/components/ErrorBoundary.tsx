import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing the app
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console (in production, send to error tracking service)
    console.error("Error Boundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-1 px-6 py-8">
            {/* Error Icon */}
            <View className="items-center mb-6">
              <View className="w-20 h-20 bg-red-100 rounded-full items-center justify-center mb-4">
                <Text className="text-4xl">⚠️</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-800 mb-2">
                Oops! Something went wrong
              </Text>
              <Text className="text-gray-600 text-center">
                The app encountered an unexpected error.
              </Text>
            </View>

            {/* Error Details (only in development) */}
            {__DEV__ && this.state.error && (
              <ScrollView className="flex-1 bg-gray-100 rounded-xl p-4 mb-4">
                <Text className="text-sm font-bold text-red-600 mb-2">
                  Error:
                </Text>
                <Text className="text-xs text-gray-800 mb-4">
                  {this.state.error.toString()}
                </Text>

                {this.state.errorInfo && (
                  <>
                    <Text className="text-sm font-bold text-red-600 mb-2">
                      Stack Trace:
                    </Text>
                    <Text className="text-xs text-gray-800 font-mono">
                      {this.state.errorInfo.componentStack}
                    </Text>
                  </>
                )}
              </ScrollView>
            )}

            {/* Reset Button */}
            <Pressable
              onPress={this.handleReset}
              className="bg-primary-600 py-4 rounded-xl items-center active:opacity-80"
            >
              <Text className="text-white font-semibold text-lg">
                Try Again
              </Text>
            </Pressable>

            {/* Help Text */}
            <Text className="text-center text-gray-500 text-sm mt-4">
              If this problem persists, please restart the app.
            </Text>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}