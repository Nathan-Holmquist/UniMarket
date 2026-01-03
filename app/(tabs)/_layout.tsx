import {View, Text} from 'react-native'
import React, {JSX} from 'react'
import {Tabs} from "expo-router";
import {ImageBackground, Image} from "react-native";
import {images} from "@/constants/images";
import {icons} from "@/constants/icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface TabIconProps {
    icon?: any,
    vector?: JSX.Element,
    focused: boolean,
    title: string
}



const TabIcon = ({icon, vector, focused, title}: TabIconProps) => {

    const tint = title === "Sell"
        ? "white"
        : focused
            ? "white"
            : "grey";

    return (
        <ImageBackground className="flex-1 flex-col items-center justify-center rounded-full mt-2 min-w-[112px] min-h-14">
            <Image
                source={icon}
                tintColor={tint}
                className="size-5"
            />
            {/*<Text>{title}</Text>*/}
        </ImageBackground>
    );

}


const _Layout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarItemStyle:{
                    width:'100%',
                    height:'100%',
                    justifyContent:'center',
                    alignItems:'center'
                },
                tabBarStyle: {
                    backgroundColor: '#202022',
                    borderColor: '#0f0D23',
                }
            }
            }
        >
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    title: 'Home',
                    tabBarActiveTintColor: 'black',
                    tabBarInactiveTintColor: 'black',
                    tabBarIcon: ({ focused }) => (
                        <>
                            <TabIcon
                                icon={icons.home}
                                focused={focused}
                                title="Home"
                            />
                        </>
                    )
                }}
            />

            <Tabs.Screen
                name="search"
                options={{
                    headerShown: false,
                    title: 'Search',
                    tabBarActiveTintColor: 'black',
                    tabBarInactiveTintColor: 'black',
                    tabBarIcon: ({ focused }) => (
                        <>
                            <TabIcon
                                icon={icons.search}
                                focused={focused}
                                title="Search"
                            />
                        </>
                    )
                }}
            />

            <Tabs.Screen
                name="sell"
                options={{
                    headerShown: false,
                    title: 'Sell',
                    tabBarActiveTintColor: 'black',
                    tabBarInactiveTintColor: 'black',
                    tabBarIcon: ({ focused }) => (
                        <>
                            <TabIcon
                                icon={icons.plus}
                                focused={focused}
                                title="Sell"
                            />
                        </>
                    )
                }}
            />

            <Tabs.Screen
                name="messages"
                options={{
                    headerShown: false,
                    title: 'Messages',
                    tabBarActiveTintColor: 'black',
                    tabBarInactiveTintColor: 'black',
                    tabBarIcon: ({ focused }) => (
                        <>
                            <TabIcon
                                icon = {icons.comment}
                                focused={focused}
                                title="Messages"
                            />
                        </>
                    )
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    headerShown: false,
                    title: 'Profile',
                    tabBarActiveTintColor: 'black',
                    tabBarInactiveTintColor: 'black',
                    tabBarIcon: ({ focused }) => (
                        <>
                            <TabIcon
                                icon={icons.person}
                                focused={focused}
                                title="Profile"
                            />
                        </>
                    )
                }}
            />
        </Tabs>
    )
}
export default _Layout
