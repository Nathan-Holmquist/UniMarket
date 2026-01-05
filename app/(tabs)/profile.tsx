import {View, Text, Pressable} from 'react-native'
import React from 'react'
import {router} from 'expo-router'

const Profile = () => {
    return (
        <View className="flex-1 items-center justify-center">

            <Pressable
                onPress={() => router.push('/login')}
                className="bg-blue-600 px-8 py-4 rounded-2xl"
            >
                <Text className="text-white font-semibold text-lg">Log Out</Text>
            </Pressable>
        </View>
    )
}
export default Profile
