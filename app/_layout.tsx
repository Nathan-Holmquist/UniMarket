import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
            name="(tabs)/home"
            options={{
              title: 'Home',
              tabBarIcon: ({ size, color }) =>
                  <Ionicons name="home-outline" size={size} color={color} />
            }}
        />
        <Tabs.Screen
            name="(tabs)/sell"
            options={{
              title: 'Sell',
              tabBarIcon: ({ size, color }) =>
                  <Ionicons name="add-circle-outline" size={size} color={color} />
            }}
        />
        <Tabs.Screen
            name="(tabs)/messages"
            options={{
              title: 'Messages',
              tabBarIcon: ({ size, color }) =>
                  <Ionicons name="chatbubble-outline" size={size} color={color} />
            }}
        />
        <Tabs.Screen
            name="(tabs)/profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ size, color }) =>
                  <Ionicons name="person-outline" size={size} color={color} />
            }}
        />
      </Tabs>
  );
}
