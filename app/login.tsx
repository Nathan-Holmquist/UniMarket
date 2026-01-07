import { View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
    const router = useRouter()
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        // Basic validation
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please enter both email and password')
            return
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email.trim())) {
            Alert.alert('Error', 'Please enter a valid email address')
            return
        }

        setLoading(true)
        try {
            await login(email.trim(), password)
            // Navigate to home after successful login
            router.replace('/(tabs)/home')
        } catch (error: any) {
            console.error('Login error:', error)

            // User-friendly error messages
            let errorMessage = 'An error occurred during login'

            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = 'Invalid email or password'
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed attempts. Please try again later.'
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your connection.'
            } else if (error.code === 'auth/user-disabled') {
                errorMessage = 'This account has been disabled.'
            }

            Alert.alert('Login Failed', errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
        >
            <View className="flex-1 justify-center bg-gray-50 p-6">
                <View className="w-full max-w-md mx-auto">
                    <Text className="text-4xl font-bold mb-2 text-gray-900 text-center">Welcome Back</Text>
                    <Text className="text-gray-600 mb-8 text-center">Sign in to continue</Text>

                    <View className="mb-4">
                        <Text className="text-gray-700 font-bold mb-2">Email</Text>
                        <TextInput
                            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            editable={!loading}
                        />
                    </View>

                    <View className="mb-6">
                        <Text className="text-gray-700 font-bold mb-2">Password</Text>
                        <TextInput
                            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            editable={!loading}
                        />
                    </View>

                    <Pressable
                        onPress={handleLogin}
                        disabled={loading}
                        className={`py-4 rounded-lg mb-4 ${loading ? 'bg-blue-400' : 'bg-blue-600 active:bg-blue-700'}`}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-semibold text-lg text-center">Log In</Text>
                        )}
                    </Pressable>

                    <View className="flex-row justify-between items-center">
                        <Pressable onPress={() => {}} disabled={loading}>
                            <Text className={`font-medium ${loading ? 'text-blue-300' : 'text-blue-600'}`}>
                                Forgot my password
                            </Text>
                        </Pressable>

                        <Pressable onPress={() => router.push('/signup')} disabled={loading}>
                            <Text className={`font-medium ${loading ? 'text-blue-300' : 'text-blue-600'}`}>
                                Create an account
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}