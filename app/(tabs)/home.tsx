import { Text, View, Image, Pressable, ImageBackground, Dimensions, ScrollView } from 'react-native';
import { icons } from '@/constants/icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TILE_SIZE = (SCREEN_WIDTH - 48) / 2; // 16px padding on each side + 16px gap

const data = [
    { id: '1', name: 'MacBook Pro 2021', price: '$850', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' },
    { id: '2', name: 'Nike Air Force 1', price: '$90', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' },
    { id: '3', name: 'Calculus Textbook', price: '$30', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' },
    { id: '4', name: 'Mini Fridge', price: '$60', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' },
    { id: '5', name: 'Desk Lamp', price: '$25', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' },
    { id: '6', name: 'Gaming Chair', price: '$120', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' },
    { id: '7', name: 'Acoustic Guitar', price: '$200', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' },
    { id: '8', name: 'Road Bike', price: '$350', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' },
];

interface Listing {
    id: string;
    name: string;
    price: string;
    image: string;
}

const ListingTile = ({ item }: { item: Listing }) => (
    <View
        style={{ width: TILE_SIZE, height: TILE_SIZE }}
        className="rounded-2xl overflow-hidden"
    >
        <ImageBackground
            source={{ uri: item.image }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
        >
            <View className="absolute bottom-0 left-0 right-0 px-3 py-2"
                style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
                <Text className="text-white font-semibold text-sm" numberOfLines={1}>{item.name}</Text>
                <Text className="text-orange-300 font-bold text-sm">{item.price}</Text>
            </View>
        </ImageBackground>
    </View>
);

export default function Home() {
    const rows: Listing[][] = [];
    for (let i = 0; i < data.length; i += 2) {
        rows.push(data.slice(i, i + 2));
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
                >
                    <Image
                        source={icons.plus}
                        style={{ width: 32, height: 32 }}
                        resizeMode="contain"
                    />
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 16 }}>
                {rows.map((row, rowIndex) => (
                    <View key={rowIndex} className="flex-row" style={{ gap: 16 }}>
                        {row.map((item) => (
                            <ListingTile key={item.id} item={item} />
                        ))}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
