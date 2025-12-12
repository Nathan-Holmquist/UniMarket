import { Stack } from 'expo-router';
import './globals.css'

const _Layout = () => {
    return (
        <Stack>

            <Stack.Screen
                name='(tabs)'
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name='movies/[id]'
                options={{
                    headerShown: false,
                }}
            />

        </Stack>
    )
}
export default _Layout
