import { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    Pressable,
    FlatList,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { icons } from '@/constants/icons';


type Message = {
    id: string
    text: string
    fromMe: boolean
    time: string
}


const sampleMessages: Record<string, Message[]> = {
    '1': [{ id: '4', text: 'This is a test', fromMe: false, time: 'Today' },],
    '2': [{ id: '3', text: 'This is a test', fromMe: false, time: 'Yesterday' },],
    '3': [{ id: '1', text: 'This is a test', fromMe: false, time: 'Mon' },],
    '4': [{ id: '1', text: 'This is a test', fromMe: false, time: 'Sun' },],
    '5': [{ id: '1', text: 'This is a test', fromMe: false, time: 'Fri' },],
}


export default function ConversationScreen() {
    const { id, name, profilePic } = useLocalSearchParams<{ id: string; name: string; profilePic?: string }>()
    const [messages, setMessages] = useState<Message[]>(sampleMessages[id] ?? [])
    const [input, setInput] = useState('')
    const listRef = useRef<FlatList>(null)


    useEffect(() => {
        // Scroll to bottom when messages load
        if (messages.length > 0) {
            setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 50)
        }
    })


    const handleSend = () => {
        const text = input.trim()
        if (!text) return
        const now = new Date()
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        setMessages(prev => [...prev, { id: String(Date.now()), text, fromMe: true, time }])
        setInput('')
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50)
    }


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
        >
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
                    <Image source={icons.arrowBack} style={styles.backIcon} resizeMode="contain" />
                </Pressable>

                <View style={styles.headerCenter}>
                    <Image
                        source={icons.userDefault}
                        style={styles.headerAvatar}
                    />
                    <Text style={styles.headerName} numberOfLines={1}>{name}</Text>
                </View>

                <View style={styles.headerRight} />
            </View>


            <FlatList
                ref={listRef}
                data={messages}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messageList}
                onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
                renderItem={({ item, index }) => {
                    const prevMsg = messages[index - 1]
                    const showTime = !prevMsg || prevMsg.time !== item.time
                    return (
                        <View>
                            {showTime && (
                                <Text style={styles.timeLabel}>{item.time}</Text>
                            )}
                            <View style={[styles.bubbleRow, item.fromMe ? styles.bubbleRowMe : styles.bubbleRowThem]}>
                                {!item.fromMe && (
                                    <Image source={icons.userDefault} style={styles.bubbleAvatar} />
                                )}
                                <View style={[styles.bubble, item.fromMe ? styles.bubbleMe : styles.bubbleThem]}>
                                    <Text style={[styles.bubbleText, item.fromMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>
                                        {item.text}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )
                }}
            />


            <View style={styles.inputBar}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Message…"
                    placeholderTextColor="#9ca3af"
                    value={input}
                    onChangeText={setInput}
                    multiline
                    maxLength={1000}
                    returnKeyType="default"
                />
                <Pressable
                    style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
                    onPress={handleSend}
                    disabled={!input.trim()}
                >
                    <Text style={styles.sendBtnText}>Send</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 56,
        paddingBottom: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        backgroundColor: '#fff',
    },
    backBtn: {
        width: 36,
        alignItems: 'flex-start',
    },
    backIcon: {
        width: 24,
        height: 24,
    },
    headerCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    headerAvatar: {
        width: 34,
        height: 34,
        borderRadius: 17,
    },
    headerName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1e3a5f',
        maxWidth: 180,
    },
    headerRight: {
        width: 36,
    },
    // Messages list
    messageList: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingBottom: 8,
    },
    timeLabel: {
        alignSelf: 'center',
        fontSize: 12,
        color: '#9ca3af',
        marginVertical: 8,
    },
    bubbleRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 6,
    },
    bubbleRowMe: {
        justifyContent: 'flex-end',
    },
    bubbleRowThem: {
        justifyContent: 'flex-start',
    },
    bubbleAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginRight: 6,
        marginBottom: 2,
    },
    bubble: {
        maxWidth: '72%',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 18,
    },
    bubbleMe: {
        backgroundColor: '#f97316',
        borderBottomRightRadius: 4,
    },
    bubbleThem: {
        backgroundColor: '#f3f4f6',
        borderBottomLeftRadius: 4,
    },
    bubbleText: {
        fontSize: 15,
        lineHeight: 21,
    },
    bubbleTextMe: {
        color: '#fff',
    },
    bubbleTextThem: {
        color: '#111827',
    },
    // Input bar
    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 10,
        paddingBottom: Platform.OS === 'ios' ? 28 : 12,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        backgroundColor: '#fff',
        gap: 10,
    },
    textInput: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        color: '#111827',
        backgroundColor: '#f9fafb',
        maxHeight: 120,
    },
    sendBtn: {
        backgroundColor: '#f97316',
        borderRadius: 22,
        paddingHorizontal: 18,
        paddingVertical: 11,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendBtnDisabled: {
        backgroundColor: '#fdba74',
    },
    sendBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
})