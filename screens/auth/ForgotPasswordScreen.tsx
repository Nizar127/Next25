"use client"

import { useState } from "react"
import { View, StyleSheet, Alert } from "react-native"
import { useAuth } from "../../hooks/useAuth"
import { Text, TextInput, Button } from "../../components/ui"
import { SafeAreaView } from "react-native-safe-area-context"

export default function ForgotPasswordScreen({ navigation }: any) {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleResetPassword() {
    if (loading) return

    if (!email) {
      Alert.alert("Error", "Please enter your email address")
      return
    }

    try {
      setLoading(true)
      await resetPassword(email)
      Alert.alert(
        "Password Reset",
        "If an account exists with this email, you will receive password reset instructions.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ],
      )
    } catch (error: any) {
      Alert.alert("Error", error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you instructions to reset your password.
        </Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <Button onPress={handleResetPassword} loading={loading} style={styles.button}>
          Send Reset Link
        </Button>

        <Button variant="text" onPress={() => navigation.navigate("Login")}>
          Back to Login
        </Button>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
  },
})

