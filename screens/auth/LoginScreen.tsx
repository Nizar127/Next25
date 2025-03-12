"use client"

import { useState } from "react"
import { View, StyleSheet, Alert } from "react-native"
import { useAuth } from "../../hooks/useAuth"
import { Text, TextInput, Button } from "../../components/ui"
import { SafeAreaView } from "react-native-safe-area-context"

export default function LoginScreen({ navigation }: any) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (loading) return

    try {
      setLoading(true)
      await signIn(email, password)
    } catch (error) {
      Alert.alert("Error", error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <Button onPress={handleLogin} loading={loading} style={styles.button}>
          Log In
        </Button>

        <Button variant="text" onPress={() => navigation.navigate("Register")}>
          Don't have an account? Sign up
        </Button>

        <Button variant="text" onPress={() => navigation.navigate("ForgotPassword")}>
          Forgot password?
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
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
  },
})

