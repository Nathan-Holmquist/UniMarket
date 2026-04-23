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
    conversation_listing_id: string
    buyer_id: string
    seller_id: string
    content: string
    created_at: string
    is_read: boolean
}


const sampleMessages: Record<string, Message[]> = {
    '1': [{ conversation_listing_id: '1', buyer_id: 'other', seller_id: 'me', content: 'This is a test', created_at: 'Today', is_read: true }],
    '2': [{ conversation_listing_id: '2', buyer_id: 'other', seller_id: 'me', content: 'This is a test', created_at: 'Yesterday', is_read: true }],
    '3': [{ conversation_listing_id: '3', buyer_id: 'other', seller_id: 'me', content: 'This is a test', created_at: 'Mon', is_read: true }],
    '4': [{ conversation_listing_id: '4', buyer_id: 'other', seller_id: 'me', content: 'This is a test', created_at: 'Sun', is_read: true }],
    '5': [{ conversation_listing_id: '5', buyer_id: 'other', seller_id: 'me', content: 'This is a test', created_at: 'Fri', is_read: true }],
}


export default function ConversationScreen() {
    const { id, name, profilePic, myId } = useLocalSearchParams<{ id: string; name: string; profilePic?: string; myId?: string }>()
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
        setMessages(prev => [...prev, {
            conversation_listing_id: id,
            buyer_id: myId ?? 'me',
            seller_id: '',
            content: text,
            created_at: time,
            is_read: false,
        }])
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
                keyExtractor={(item, index) => `${item.created_at}-${index}`}
                contentContainerStyle={styles.messageList}
                onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
                renderItem={({ item, index }) => {
                    const fromMe = item.buyer_id === (myId ?? 'me')
                    const prevMsg = messages[index - 1]
                    const showTime = !prevMsg || prevMsg.created_at !== item.created_at
                    return (
                        <View>
                            {showTime && (
                                <Text style={styles.timeLabel}>{item.created_at}</Text>
                            )}
                            <View style={[styles.bubbleRow, fromMe ? styles.bubbleRowMe : styles.bubbleRowThem]}>
                                {!fromMe && (
                                    <Image source={icons.userDefault} style={styles.bubbleAvatar} />
                                )}
                                <View style={[styles.bubble, fromMe ? styles.bubbleMe : styles.bubbleThem]}>
                                    <Text style={[styles.bubbleText, fromMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>
                                        {item.content}
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