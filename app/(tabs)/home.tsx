import { useState, useEffect, useCallback } from 'react';
import { Text, View, Image, Pressable, ImageBackground, Dimensions, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { icons } from '@/constants/icons';
import {router} from "expo-router";

const SCREEN_WIDTH = Dimensions.get('window').width;
const TILE_SIZE = (SCREEN_WIDTH - 48) / 2; // 16px padding on each side + 16px gap

const API_URL = 'http://192.168.1.188:3000';

interface Listing {
    Id: string;
    Name: string;
    Price: string;
    ImageUrl: string;
}

const ListingTile = ({ item }: { item: Listing }) => (
    <Pressable
        style={{ width: TILE_SIZE, height: TILE_SIZE }}
        className="rounded-2xl overflow-hidden active:opacity-80"
        onPress={() => router.push({ pathname: '/listing', params: { id: item.Id } })}
    >
        <ImageBackground
            source={{ uri: item.ImageUrl }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
        >
            <View className="absolute bottom-0 left-0 right-0 px-3 py-2"
                style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
                <Text className="text-white font-semibold text-sm" numberOfLines={1}>{item.Name}</Text>
                <Text className="text-orange-300 font-bold text-sm">{item.Price}</Text>
            </View>
        </ImageBackground>
    </Pressable>
);



export default function Home() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchListings = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/listings`);
            const data = await res.json();
            setListings(data);
        } catch (err) {
            console.error('Failed to fetch listings:', err);
        }
    }, []);

    useEffect(() => {
        fetchListings().finally(() => setLoading(false));
    }, [fetchListings]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchListings();
        setRefreshing(false);
    }, [fetchListings]);

    const rows: Listing[][] = [];
    for (let i = 0; i < listings.length; i += 2) {
        rows.push(listings.slice(i, i + 2));
    }

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 pt-14 pb-4">
                <View className="flex-row items-end">
                    <Text style={{ fontSize: 36, fontWeight: '900', letterSpacing: -1 }}>
                        <Text style={{ color: '#f97316' }}>Uni</Text>
                        <Text style={{ color: '#1e3a5f' }}>Market</Text>
                    </Text>
                </View>
                <Pressable
                    className="p-1 active:opacity-60"
                    hitSlop={12}
                    onPress={() => router.push('/create-listing')}
                >
                    <Image
                        source={icons.plus}
                        style={{ width: 32, height: 32 }}
                        resizeMode="contain"
                    />
                </Pressable>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#f97316" style={{ marginTop: 40 }} />
            ) : (
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingBottom: 24, gap: 16 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" />}
                >
                    {rows.map((row, rowIndex) => (
                        <View key={rowIndex} className="flex-row" style={{ gap: 16 }}>
                            {row.map((item) => (
                                <ListingTile key={item.Id} item={item} />
                            ))}
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}
