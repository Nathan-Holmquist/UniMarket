import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Image, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { icons } from '@/constants/icons';
import * as ImagePicker from 'expo-image-picker';

export default function Listing() {
    const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    const handleAddPhoto = (index: number) => {
        Alert.alert('Add Photo', '', [
            {
                text: 'Take Photo',
                onPress: () => handleTakePhoto(index),
            },
            {
                text: 'Choose from Library',
                onPress: () => handlePickFromLibrary(index),
            },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    const handleTakePhoto = async (index: number) => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') return;

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            const updated = [...photos];
            updated[index] = result.assets[0].uri;
            setPhotos(updated);
        }
    };

    const handlePickFromLibrary = async (index: number) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            const updated = [...photos];
            updated[index] = result.assets[0].uri;
            setPhotos(updated);
        }
    };

    const handleRemovePhoto = (index: number) => {
        const updated = [...photos]; // ... copies the original instead of referencing it
        updated[index] = null;
        setPhotos(updated);
    };

    const handleListItem = () => {
        // Push all data to DB
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
                    <Image source={icons.arrowBack} style={styles.backIcon} resizeMode="contain" />
                </Pressable>
                <Text style={styles.headerTitle}>Create Listing</Text>
                <View style={styles.backBtn} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

                <Text style={styles.sectionLabel}>Photos <Text style={styles.subLabel}>(up to 4)</Text></Text>
                <View style={styles.photoGrid}>
                    {photos.map((photo, index) => (
                        <Pressable
                            key={index}
                            style={styles.photoSlot}
                            onPress={() => handleAddPhoto(index)}
                        >
                            {photo ? (
                                <>
                                    <Image source={{ uri: photo }} style={styles.photoImage} />
                                    <Pressable
                                        style={styles.removePhotoBtn}
                                        onPress={() => handleRemovePhoto(index)}
                                        hitSlop={8}
                                    >
                                        <Text style={styles.removePhotoText}>✕</Text>
                                    </Pressable>
                                </>
                            ) : (
                                <View style={styles.photoPlaceholder}>
                                    <Image source={icons.plus} style={styles.photoPlaceholderIcon} resizeMode="contain" tintColor="#9ca3af" />
                                    <Text style={styles.photoPlaceholderText}>Add photo</Text>
                                </View>
                            )}
                        </Pressable>
                    ))}
                </View>


                <Text style={styles.sectionLabel}>Item name</Text>
                <TextInput
                    style={styles.input}
                    //placeholder="enter the name of your item"
                    placeholderTextColor="#9ca3af"
                    value={name}
                    onChangeText={setName}
                    returnKeyType="next"
                />


                <Text style={styles.sectionLabel}>Price</Text>
                <View style={styles.priceRow}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                        style={[styles.input, styles.priceInput]}
                        placeholder="0.00"
                        placeholderTextColor="#9ca3af"
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="decimal-pad"
                        returnKeyType="next"
                    />
                </View>

                {/* Description */}
                <Text style={styles.sectionLabel}>Description</Text>
                <TextInput
                    style={[styles.input, styles.descriptionInput]}

                    placeholder="Describe your item"

                    placeholderTextColor="#9ca3af"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    textAlignVertical="top"
                    returnKeyType="done"
                />

                {/* Submit */}
                <Pressable style={styles.listBtn} onPress={handleListItem}>
                    <Text style={styles.listBtnText}>List Item</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 56,
        paddingBottom: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    backBtn: {
        width: 36,
        alignItems: 'flex-start',
    },
    backIcon: {
        width: 24,
        height: 24,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e3a5f',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 48,
        gap: 8,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginTop: 12,
        marginBottom: 6,
    },
    subLabel: {
        fontWeight: '400',
        color: '#9ca3af',
    },
    photoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    photoSlot: {
        width: '47%',
        aspectRatio: 1,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
        borderStyle: 'dashed',
        overflow: 'hidden',
        backgroundColor: '#f9fafb',
    },
    photoImage: {
        width: '100%',
        height: '100%',
    },
    removePhotoBtn: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: 'rgba(0,0,0,0.55)',
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removePhotoText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    photoPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    photoPlaceholderIcon: {
        width: 28,
        height: 28,
    },
    photoPlaceholderText: {
        fontSize: 12,
        color: '#9ca3af',
    },
    input: {
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: '#111827',
        backgroundColor: '#f9fafb',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencySymbol: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        position: 'absolute',
        left: 14,
        zIndex: 1,
    },
    priceInput: {
        flex: 1,
        paddingLeft: 28,
    },
    descriptionInput: {
        height: 120,
        paddingTop: 12,
    },
    listBtn: {
        marginTop: 24,
        backgroundColor: '#f97316',
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
    },
    listBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});