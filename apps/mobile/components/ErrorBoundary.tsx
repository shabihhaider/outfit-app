import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, Platform, StatusBar } from "react-native";

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
        <View style={styles.container}>
          <View style={styles.content}>
            {/* Error Icon */}
            <View style={styles.errorIconContainer}>
              <View style={styles.errorIcon}>
                <Text style={styles.errorEmoji}>⚠️</Text>
              </View>
              <Text style={styles.errorTitle}>
                Oops! Something went wrong
              </Text>
              <Text style={styles.errorSubtitle}>
                The app encountered an unexpected error.
              </Text>
            </View>

            {/* Error Details (only in development) */}
            {__DEV__ && this.state.error && (
              <ScrollView style={styles.errorDetails}>
                <Text style={styles.errorLabel}>
                  Error:
                </Text>
                <Text style={styles.errorText}>
                  {this.state.error.toString()}
                </Text>

                {this.state.errorInfo && (
                  <>
                    <Text style={styles.errorLabel}>
                      Stack Trace:
                    </Text>
                    <Text style={styles.stackTrace}>
                      {this.state.errorInfo.componentStack}
                    </Text>
                  </>
                )}
              </ScrollView>
            )}

            {/* Reset Button */}
            <Pressable
              onPress={this.handleReset}
              style={({ pressed }) => [
                styles.resetButton,
                pressed && styles.resetButtonPressed
              ]}
            >
              <Text style={styles.resetButtonText}>
                Try Again
              </Text>
            </Pressable>

            {/* Help Text */}
            <Text style={styles.helpText}>
              If this problem persists, please restart the app.
            </Text>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  errorIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  errorIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#fee2e2',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  errorEmoji: {
    fontSize: 36,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  errorDetails: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  errorLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#1f2937',
    marginBottom: 16,
  },
  stackTrace: {
    fontSize: 12,
    color: '#1f2937',
    fontFamily: 'monospace',
  },
  resetButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonPressed: {
    opacity: 0.8,
  },
  resetButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 18,
  },
  helpText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
    marginTop: 16,
  },
});
