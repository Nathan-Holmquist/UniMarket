import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { icons } from "@/constants/icons"

const NAVY = '#1e3a5f';
const ORANGE = '#f97316';

type MenuRowProps = {
    label: string
    onPress?: () => void
    danger?: boolean
}

const MenuRow = ({ label, onPress, danger }: MenuRowProps) => (
    <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center bg-white border-b border-gray-100 px-4"
        style={{ height: 56 }}
        activeOpacity={0.6}
    >
        <Text
            className="flex-1 text-base font-semibold"
            style={{ color: danger ? ORANGE : NAVY }}
        >
            {label}
        </Text>
        {!danger && (
            <Text className="text-gray-300 text-lg">›</Text>
        )}
    </TouchableOpacity>
)

const Profile = () => {
    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="px-4 pt-14 pb-4">
                <Text className="text-5xl font-bold" style={{ color: NAVY }}>Profile</Text>
            </View>

            <ScrollView>
                {/* Avatar section */}
                <View className="items-center py-8">
                    <View>
                        <Image
                            source={icons.userDefault}
                            style={{ width: 96, height: 96, borderRadius: 48 }}
                        />
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                backgroundColor: ORANGE,
                                borderRadius: 12,
                                padding: 4,
                            }}
                            onPress={() => console.log('change photo')}
                        >
                            <Image
                                source={icons.swapImage}
                                style={{ width: 16, height: 16, tintColor: 'white' }}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text className="mt-3 text-xl font-bold" style={{ color: NAVY }}>Your Name</Text>
                    <Text className="text-sm text-gray-400">your@email.edu</Text>
                </View>

                {/* Menu items */}
                <View className="border-t border-gray-100">
                    <MenuRow label="Transaction History" onPress={() => console.log('Transaction History')} />
                    <MenuRow label="Saved Listings" onPress={() => console.log('Saved Listings')} />
                    <MenuRow label="Settings" onPress={() => console.log('Settings')} />
                </View>

                <View className="border-t border-gray-100 mt-6">
                    <MenuRow label="Log Out" onPress={() => router.push('/login')} danger />
                </View>
            </ScrollView>
        </View>
    )
}

export default Profile