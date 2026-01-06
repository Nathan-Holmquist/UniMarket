import { View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'

export default function Signup() {
    const router = useRouter()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSignup = () => {
        // TODO: Implement actual signup logic with validation
        router.push('/login')
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
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-gray-700 font-bold mb-2">Password</Text>
                            <TextInput
                                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
                                placeholder="Create a password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
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
                            />
                        </View>

                        <Pressable
                            onPress={handleSignup}
                            className="bg-blue-600 py-4 rounded-lg mb-4 active:bg-blue-700"
                        >
                            <Text className="text-white font-semibold text-lg text-center">Create Account</Text>
                        </Pressable>

                        <View className="flex-row justify-center items-center">
                            <Text className="text-gray-600">Already have an account? </Text>
                            <Pressable onPress={() => router.back()}>
                                <Text className="text-blue-600 font-medium">Sign in</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}