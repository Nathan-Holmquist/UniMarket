import { useState, useEffect, useRef } from 'react';
import { View, Text, Image, Pressable, ScrollView, TextInput, StyleSheet, Dimensions, Modal, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { icons } from '@/constants/icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const API_URL = 'http://192.168.1.188:3000';

interface ListingDetail {
    Id: string;
    Title: string;
    Description: string | null;
    Price: string;
    imageURL1: string | null;
    imageURL2: string | null;
    imageURL3: string | null;
    imageURL4: string | null;
}

export default function ListingPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [listing, setListing] = useState<ListingDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [imageIndex, setImageIndex] = useState(0);
    const [message, setMessage] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const [saved, setSaved] = useState(false);
    const scrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        if (!id) return;
        fetch(`${API_URL}/listings/${id}`)
            .then(res => res.json())
            .then(data => setListing(data))
            .catch(err => console.error('Failed to fetch listing:', err))
            .finally(() => setLoading(false));
    }, [id]);

    const images = listing
        ? [listing.imageURL1, listing.imageURL2, listing.imageURL3, listing.imageURL4].filter(Boolean) as string[]
        : [];

    const goToImage = (index: number) => {
        const clamped = Math.max(0, Math.min(index, images.length - 1));
        setImageIndex(clamped);
        scrollRef.current?.scrollTo({ x: clamped * SCREEN_WIDTH, animated: true });
    };

    const handleSend = () => {
        if (!message.trim()) return;
        setMessage('');
    };

    const handleSaveListing = () => {
        setSaved(true);
        setMenuVisible(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} hitSlop={12} style={styles.headerSide}>
                    <Image source={icons.arrowBack} style={styles.backIcon} resizeMode="contain" />
                </Pressable>
                <Text style={styles.headerTitle}>Listing</Text>
                <View style={styles.headerSide}>
                    <Pressable onPress={() => setMenuVisible(true)} hitSlop={12} style={styles.menuBtn}>
                        <Text style={styles.menuDots}>•••</Text>
                    </Pressable>
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#f97316" style={{ marginTop: 40 }} />
            ) : !listing ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Listing not found.</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    <View style={styles.carouselContainer}>
                        {images.length > 0 ? (
                            <>
                                <ScrollView
                                    ref={scrollRef}
                                    horizontal
                                    pagingEnabled
                                    showsHorizontalScrollIndicator={false}
                                    scrollEventThrottle={16}
                                    onMomentumScrollEnd={(e) => {
                                        const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                                        setImageIndex(index);
                                    }}
                                >
                                    {images.map((uri, i) => (
                                        <Image key={i} source={{ uri }} style={styles.carouselImage} resizeMode="cover" />
                                    ))}
                                </ScrollView>

                                {imageIndex > 0 && (
                                    <Pressable style={[styles.arrowBtn, styles.arrowLeft]} onPress={() => goToImage(imageIndex - 1)}>
                                        <Text style={styles.arrowText}>‹</Text>
                                    </Pressable>
                                )}
                                {imageIndex < images.length - 1 && (
                                    <Pressable style={[styles.arrowBtn, styles.arrowRight]} onPress={() => goToImage(imageIndex + 1)}>
                                        <Text style={styles.arrowText}>›</Text>
                                    </Pressable>
                                )}

                                {images.length > 1 && (
                                    <View style={styles.dotsRow}>
                                        {images.map((_, i) => (
                                            <Pressable key={i} onPress={() => goToImage(i)}>
                                                <View style={[styles.dot, i === imageIndex && styles.dotActive]} />
                                            </Pressable>
                                        ))}
                                    </View>
                                )}
                            </>
                        ) : (
                            <View style={styles.noImagePlaceholder}>
                                <Text style={styles.noImageText}>No images</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.titleRow}>
                        <Text style={styles.title} numberOfLines={2}>{listing.Title}</Text>
                        <Text style={styles.price}>${listing.Price}</Text>
                    </View>

                    {listing.Description ? (
                        <>
                            <Text style={styles.sectionLabel}>Description</Text>
                            <Text style={styles.description}>{listing.Description}</Text>
                        </>
                    ) : null}

                    <Text style={styles.sectionLabel}>Message seller</Text>
                    <View style={styles.messageRow}>
                        <TextInput
                            style={styles.messageInput}
                            placeholder="Ask a question…"
                            placeholderTextColor="#9ca3af"
                            value={message}
                            onChangeText={setMessage}
                            multiline
                        />
                        <Pressable
                            style={[styles.sendBtn, !message.trim() && styles.sendBtnDisabled]}
                            onPress={handleSend}
                            disabled={!message.trim()}
                        >
                            <Text style={styles.sendBtnText}>Send</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            )}

            <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <Pressable style={StyleSheet.absoluteFill} onPress={() => setMenuVisible(false)}>
                    <Pressable style={styles.dropdown}>
                        <Pressable style={styles.dropdownItem} onPress={handleSaveListing}>
                            <Image source={icons.save} style={styles.dropdownIcon} resizeMode="contain" />
                            <Text style={styles.dropdownText}>{saved ? 'Saved!' : 'Save Listing'}</Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 56,
        paddingBottom: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    headerSide: {
        width: 36,
        alignItems: 'flex-start',
    },
    backIcon: {
        width: 24,
        height: 24,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e3a5f',
    },
    menuBtn: {
        alignItems: 'flex-end',
        width: 36,
    },
    menuDots: {
        fontSize: 16,
        color: '#374151',
        letterSpacing: 1,
        fontWeight: '700',
    },
    scrollContent: {
        paddingBottom: 48,
    },
    carouselContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH * 0.75,
        backgroundColor: '#f3f4f6',
    },
    carouselImage: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH * 0.75,
    },
    noImagePlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noImageText: {
        color: '#9ca3af',
        fontSize: 15,
    },
    arrowBtn: {
        position: 'absolute',
        top: '50%',
        marginTop: -24,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.35)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrowLeft: {
        left: 10,
    },
    arrowRight: {
        right: 10,
    },
    arrowText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '300',
        lineHeight: 32,
    },
    dotsRow: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    dotActive: {
        backgroundColor: '#f97316',
        width: 18,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        gap: 12,
    },
    title: {
        flex: 1,
        fontSize: 22,
        fontWeight: '800',
        color: '#1e3a5f',
        lineHeight: 28,
    },
    price: {
        fontSize: 22,
        fontWeight: '800',
        color: '#f97316',
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginTop: 20,
        marginBottom: 6,
        paddingHorizontal: 20,
    },
    description: {
        fontSize: 15,
        color: '#4b5563',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        gap: 10,
    },
    messageInput: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: '#111827',
        backgroundColor: '#f9fafb',
        maxHeight: 120,
    },
    sendBtn: {
        backgroundColor: '#f97316',
        borderRadius: 10,
        paddingHorizontal: 18,
        paddingVertical: 13,
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
    modalOverlay: {
        flex: 1,
    },
    dropdown: {
        position: 'absolute',
        top: 100,
        right: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 8,
        minWidth: 160,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 10,
    },
    dropdownIcon: {
        width: 20,
        height: 20,
        tintColor: '#1e3a5f',
    },
    dropdownText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e3a5f',
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#6b7280',
    },
});