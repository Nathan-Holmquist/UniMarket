import { View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'

export default function Login() {
    const router = useRouter()
    const [emailOrUsername, setEmailOrUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = () => {
        // TODO: Implement actual login logic
        router.push('/(tabs)/home')
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
                        <Text className="text-gray-700 font-medium mb-2">Username or Email</Text>
                        <TextInput
                            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
                            placeholder="Enter your username or email"
                            value={emailOrUsername}
                            onChangeText={setEmailOrUsername}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View className="mb-6">
                        <Text className="text-gray-700 font-medium mb-2">Password</Text>
                        <TextInput
                            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <Pressable
                        onPress={handleLogin}
                        className="bg-blue-600 py-4 rounded-lg mb-4 active:bg-blue-700"
                    >
                        <Text className="text-white font-semibold text-lg text-center">Log In</Text>
                    </Pressable>

                    <View className="flex-row justify-between items-center">
                        <Pressable onPress={() => {}}>
                            <Text className="text-blue-600 font-medium">Forgot my password</Text>
                        </Pressable>

                        <Pressable onPress={() => router.push('/signup')}>
                            <Text className="text-blue-600 font-medium">Create an account</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}