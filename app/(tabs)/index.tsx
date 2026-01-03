import {Text, View} from 'react-native';
import {Link} from "expo-router";
import ItemCard from '@/components/ItemCard';


export default function Index(){
    return (
        <View className="flex-1 items-center pt-20 bg-dark-100">
            <View className="w-full py-6  items-start">
                <Text className= "text-5xl font-bold">
                    <Text className = "text-blue-500">Campus</Text>
                    <Text className = "text-red-500">Mart</Text>
                </Text>
            </View>
            <View className ="grid grid-cols-2 gap-4 px-4">
                <ItemCard
                    image="https://imgs.search.brave.com/ACedRZHztn-OEwyhM1B15tdkWFNDmr_vu6lbM9Pyr10/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4t/ZnJvbnQuZnJlZXBp/ay5jb20vaG9tZS9h/bm9uLXJ2bXAvY3Jl/YXRpdmUtc3VpdGUv/cGhvdG9ncmFwaHkv/cmVpbWFnaW5lLndl/YnA"
                    price={49.99}
                    description="Lightly used bicycle, great condition"
                    onPress={() => console.log('open item')}
                    />
            </View>
        </View>
    )
}
