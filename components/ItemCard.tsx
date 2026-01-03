import React from 'react'
import { ImageBackground, Text, Pressable, View, ImageSourcePropType, StyleProp, ViewStyle } from 'react-native'

export type ItemCardProps = {
  image: string | ImageSourcePropType
  price: string | number
  description?: string
  onPress?: () => void
  style?: StyleProp<ViewStyle>
}

export default function ItemCard({ image, price, description, onPress, style }: ItemCardProps) {
  const source = typeof image === 'string' ? { uri: image } : image

  return (
    <Pressable onPress={onPress} className="rounded-2xl overflow-hidden" style={style}>
      <ImageBackground source={source} resizeMode="cover" className="w-full h-52 bg-gray-200">
        <View className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full">
          <Text className="text-sm font-semibold">${price}</Text>
        </View>

        <View className="absolute bottom-0 left-0 right-0 bg-black/40 px-3 py-2">
          <Text numberOfLines={2} className="text-white text-sm">{description}</Text>
        </View>
      </ImageBackground>
    </Pressable>
  )
}
