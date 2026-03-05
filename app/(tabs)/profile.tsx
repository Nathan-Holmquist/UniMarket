import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {router} from 'expo-router'
import {icons} from "@/constants/icons"

const Profile = () => {
    return (
        <SafeAreaProvider>
            <View className='flex-1 items-center pt-20 '>
                <Text className='text-4xl font-bold p-[20px]'>Profile</Text>
                <Image source={icons.userDefault} style={styles.image}/>
                <Image source={icons.swapImage} className='absolute top-[255px] right-[135px] w-8 h-8'/>
                <View>
                    <TouchableOpacity
                        className="bg-blue-600 px-[20px] py-[20px] rounded-2xl p-10"
                        onPress={() => {
                            console.log('You tapped the button!');
                        }}>
                        <Text className="text-white font-semibold text-lg">Transaction History</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-blue-600 px-8 py-4 rounded-2xl"
                        onPress={() => {
                            console.log('You tapped the button!');
                        }}>
                        <Text className="text-white font-semibold text-lg">Saved Listing</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-blue-600 px-8 py-4 rounded-2xl"
                        onPress={() => {
                            console.log('You tapped the button!');
                        }}>
                        <Text className="text-white font-semibold text-lg">Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.push('/login')}
                        className="bg-blue-600 px-8 py-4 rounded-2xl"
                    >
                        <Text className="text-white font-semibold text-lg">Log Out</Text>
                    </TouchableOpacity>
                    </View>
            </View>
        </SafeAreaProvider>
    )
}
export default Profile

const styles = StyleSheet.create({
    image: {
        width: 100,
        height:100,
        marginVertical: 40, // pixels of padding on top and bottom
    },
    swapImage: {
        width: 25,
        height: 25,
    }
})

