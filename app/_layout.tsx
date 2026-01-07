import { Stack } from 'expo-router'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const _Layout = () => {
    return (
        <AuthProvider>
            <Stack
                screenOptions={{ headerShown: false }}
                initialRouteName="index"  // Start on index which redirects to login
            >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="login" />
                <Stack.Screen name="signup" />
                <Stack.Screen name="(tabs)" />
            </Stack>
        </AuthProvider>
    )
}

export default _Layout