import {Text, View} from 'react-native';
import {Link} from "expo-router";



export default function Home(){
    return (
        <View className="flex-1 items-center pt-20 bg-dark-100">
            <View className="w-full py-6  items-start">
                <Text className= "text-5xl font-bold">
                    <Text className = "text-blue-500">Campus</Text>
                    <Text className = "text-red-500">Mart</Text>
                </Text>
            </View>
        </View>
    )
}
