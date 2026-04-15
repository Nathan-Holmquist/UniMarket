import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { icons } from "@/constants/icons"

// All data we need to pull from database
type Conversation = {
    id: string
    name: string
    lastMessage: string
    date: string
    profilePic?: any
}

// This data can be pulled from the database and be made into a list
// Right now there is no profilePic data in the test data so it will default to the default icon
const conversations: Conversation[] = [
    { id: '1', name: 'Alice', lastMessage: 'This is a test', date: 'Today' },
    { id: '2', name: 'Bob', lastMessage: 'This is a test', date: 'Yesterday' },
    { id: '3', name: 'Nathan', lastMessage: 'This is a test', date: 'Mon' },
    { id: '4', name: 'David', lastMessage: 'This is a test', date: 'Sun' },
    { id: '5', name: 'Kaleb', lastMessage: 'This is a test', date: 'Fri' },
]

type ConversationRowProps = {
    name: string
    lastMessage: string
    date: string
    profilePic?: any
    onPress?: () => void
}

const ConversationRow = ({ name, lastMessage, date, profilePic, onPress }: ConversationRowProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center bg-white border-b border-gray-100 px-4"
            style={{ height: 72 }}
        >
            <Image
                source={profilePic ?? icons.userDefault}
                className="rounded-full mr-3"
                style={{ width: 52, height: 52 }}
            />

            <View className="flex-1 justify-center">
                <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
                    {name}
                </Text>
                <Text className="text-sm text-gray-400 mt-0.5" numberOfLines={1}>
                    {lastMessage}
                </Text>
            </View>

            <Text className="text-xs text-gray-400 self-end mb-2 ml-2">
                {date}
            </Text>
        </TouchableOpacity>
    )
}

const Messages = () => {
    return (
        <View className="flex-1 pt-20 bg-white">
            <View className="px-4 pb-4">
                <Text className="text-5xl font-bold">Messages</Text>
            </View>

            <ScrollView>
                {conversations.map((convo) => (
                    <ConversationRow
                        key={convo.id}
                        name={convo.name}
                        lastMessage={convo.lastMessage}
                        date={convo.date}
                        profilePic={convo.profilePic}
                        onPress={() => router.push({ pathname: '/conversation', params: { id: convo.id, name: convo.name } })}
                    />
                ))}
            </ScrollView>
        </View>
    )
}

export default Messages