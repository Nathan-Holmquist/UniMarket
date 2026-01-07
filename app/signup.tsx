import { View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function Signup() {
    const router = useRouter()
    const { signup } = useAuth()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const validateForm = (): { valid: boolean; error?: string } => {
        // Check for empty fields
        if (!firstName.trim()) return { valid: false, error: 'First name is required' }
        if (!lastName.trim()) return { valid: false, error: 'Last name is required' }
        if (!username.trim()) return { valid: false, error: 'Username is required' }
        if (!email.trim()) return { valid: false, error: 'Email is required' }
        if (!address.trim()) return { valid: false, error: 'Address is required' }
        if (!password) return { valid: false, error: 'Password is required' }
        if (!confirmPassword) return { valid: false, error: 'Please confirm your password' }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email.trim())) {
            return { valid: false, error: 'Please enter a valid email address' }
        }

        // Username validation (alphanumeric, underscores, 3-20 chars)
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
        if (!usernameRegex.test(username.trim())) {
            return { valid: false, error: 'Username must be 3-20 characters (letters, numbers, underscores only)' }
        }

        // Password strength validation
        if (password.length < 6) {
            return { valid: false, error: 'Password must be at least 6 characters' }
        }

        // Password match validation
        if (password !== confirmPassword) {
            return { valid: false, error: 'Passwords do not match' }
        }

        return { valid: true }
    }

    const handleSignup = async () => {
        // Validate form
        const validation = validateForm()
        if (!validation.valid) {
            Alert.alert('Validation Error', validation.error)
            return
        }

        setLoading(true)
        try {
            await signup({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                username: username.trim(),
                email: email.trim(),
                address: address.trim(),
                password,
            })
            // Navigate to home after successful signup
            router.replace('/(tabs)/home')
        } catch (error: any) {
            console.error('Signup error:', error)

            // User-friendly error messages
            let errorMessage = 'An error occurred during signup'

            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already registered. Please login instead.'
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address'
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak. Please choose a stronger password.'
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your connection.'
            } else if (error.code === 'auth/operation-not-allowed') {
                errorMessage = 'Email/password authentication is not enabled.'
            }

            Alert.alert('Signup Failed', errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
        >
            <ScrollView className="flex-1 bg-gray-50 pt-3"
                        keyboardDismissMode="on-drag">
                <View className="p-6 pt-12">
                    <View className="w-full max-w-md mx-auto ">
                        <Text className="text-4xl font-bold mb-2 text-gray-900 text-center">Sign up to get started</Text>

                        <View className="mb-4">
                            <Text className="text-gray-700 font-bold mb-2 ">First Name</Text>
                            <TextInput
                                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
                                placeholder="Enter your first name"
                                value={firstName}
                                onChangeText={setFirstName}
                                autoCapitalize="words"
                                editable={!loading}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-gray-700 font-bold mb-2">Last Name</Text>
                            <TextInput
                                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
                                placeholder="Enter your last name"
                                value={lastName}
                                onChangeText={setLastName}
                                autoCapitalize="words"
                                editable={!loading}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-gray-700 font-bold mb-2">Username</Text>
                            <TextInput
                                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
                                placeholder="Choose a username"
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                                editable={!loading}
                            />
                        </View>

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

                        <View className="mb-4">
                            <Text className="text-gray-700 font-bold mb-2">Address</Text>
                            <TextInput
                                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
                                placeholder="Enter your address"
                                value={address}
                                onChangeText={setAddress}
                                autoCapitalize="words"
                                multiline
                                editable={!loading}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-gray-700 font-bold mb-2">Password</Text>
                            <TextInput
                                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
                                placeholder="Create a password (min 6 characters)"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                editable={!loading}
                            />
                        </View>

                        <View className="mb-6">
                            <Text className="text-gray-700 font-bold mb-2">Confirm Password</Text>
                            <TextInput
                                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                editable={!loading}
                            />
                        </View>

                        <Pressable
                            onPress={handleSignup}
                            disabled={loading}
                            className={`py-4 rounded-lg mb-4 ${loading ? 'bg-blue-400' : 'bg-blue-600 active:bg-blue-700'}`}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-semibold text-lg text-center">Create Account</Text>
                            )}
                        </Pressable>

                        <View className="flex-row justify-center items-center">
                            <Text className="text-gray-600">Already have an account? </Text>
                            <Pressable onPress={() => router.back()} disabled={loading}>
                                <Text className={`font-medium ${loading ? 'text-blue-300' : 'text-blue-600'}`}>
                                    Sign in
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}