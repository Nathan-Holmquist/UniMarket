import {View, Text, Pressable, StyleSheet, Image} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {router} from 'expo-router'
import {icons} from "@/constants/icons";

const Profile = () => {
    return (
        <SafeAreaProvider>
            <View className='flex-1 items-center pt-20 '>
                <Text className='text-4xl font-bold p-[20px]'>Profile</Text>
                <Image source={icons.userDefault} style={styles.image}/>

                <Pressable
                    onPress={() => router.push('/login')}
                    className="bg-blue-600 px-8 py-4 rounded-2xl"
                >
                    <Text className="text-white font-semibold text-lg">Log Out</Text>
                </Pressable>
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
    }
})

