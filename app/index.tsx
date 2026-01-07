import { Redirect } from 'expo-router'
import { useAuth } from '@/contexts/AuthContext'
import { View, ActivityIndicator } from 'react-native'

export default function Index() {
    const { user, loading } = useAuth()

    // Show loading spinner while checking auth state
    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        )
    }

    // Redirect based on auth state
    if (user) {
        return <Redirect href="/(tabs)/home" />
    } else {
        return <Redirect href="/login" />
    }
}