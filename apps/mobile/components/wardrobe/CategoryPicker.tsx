import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Modal,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ItemCategory } from '../../types/wardrobe';
import { CATEGORIES, SUBCATEGORIES, getCategoryInfo } from '../../constants/categories';

interface CategoryPickerProps {
    category: ItemCategory | null;
    subcategory: string | null;
    onCategoryChange: (category: ItemCategory) => void;
    onSubcategoryChange: (subcategory: string | null) => void;
    error?: string;
    disabled?: boolean;
}

export function CategoryPicker({
    category,
    subcategory,
    onCategoryChange,
    onSubcategoryChange,
    error,
    disabled = false,
}: CategoryPickerProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [step, setStep] = useState<'category' | 'subcategory'>('category');

    const categoryInfo = category ? getCategoryInfo(category) : null;
    const subcategories = category ? SUBCATEGORIES[category] : [];

    const handleCategorySelect = (cat: ItemCategory) => {
        onCategoryChange(cat);
        onSubcategoryChange(null);

        const subs = SUBCATEGORIES[cat];
        if (subs && subs.length > 0) {
            setStep('subcategory');
        } else {
            setModalVisible(false);
            setStep('category');
        }
    };

    const handleSubcategorySelect = (sub: string | null) => {
        onSubcategoryChange(sub);
        setModalVisible(false);
        setStep('category');
    };

    const displayText = categoryInfo
        ? subcategory
            ? `${categoryInfo.label} > ${subcategory}`
            : categoryInfo.label
        : 'Select category';

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Category *</Text>
            <Pressable
                style={[
                    styles.selector,
                    error && styles.selectorError,
                    disabled && styles.selectorDisabled,
                ]}
                onPress={() => setModalVisible(true)}
                disabled={disabled}
            >
                <View style={styles.selectorContent}>
                    {categoryInfo && (
                        <Text style={styles.categoryIcon}>{categoryInfo.icon}</Text>
                    )}
                    <Text
                        style={[
                            styles.selectorText,
                            !category && styles.placeholderText,
                        ]}
                    >
                        {displayText}
                    </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color="#6b7280" />
            </Pressable>
            {error && <Text style={styles.errorText}>{error}</Text>}

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => {
                    setModalVisible(false);
                    setStep('category');
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            {step === 'subcategory' && (
                                <Pressable
                                    onPress={() => setStep('category')}
                                    style={styles.backButton}
                                >
                                    <Ionicons name="arrow-back" size={24} color="#1e3a5f" />
                                </Pressable>
                            )}
                            <Text style={styles.modalTitle}>
                                {step === 'category' ? 'Select Category' : `Select ${categoryInfo?.label} Type`}
                            </Text>
                            <Pressable
                                onPress={() => {
                                    setModalVisible(false);
                                    setStep('category');
                                }}
                            >
                                <Ionicons name="close" size={24} color="#6b7280" />
                            </Pressable>
                        </View>

                        <ScrollView style={styles.optionsList}>
                            {step === 'category' ? (
                                CATEGORIES.map((cat) => (
                                    <Pressable
                                        key={cat.value}
                                        style={[
                                            styles.option,
                                            category === cat.value && styles.optionSelected,
                                        ]}
                                        onPress={() => handleCategorySelect(cat.value)}
                                    >
                                        <Text style={styles.optionIcon}>{cat.icon}</Text>
                                        <Text style={styles.optionText}>{cat.label}</Text>
                                        {category === cat.value && (
                                            <Ionicons name="checkmark" size={20} color="#1e3a5f" />
                                        )}
                                    </Pressable>
                                ))
                            ) : (
                                <>
                                    <Pressable
                                        style={[styles.option, !subcategory && styles.optionSelected]}
                                        onPress={() => handleSubcategorySelect(null)}
                                    >
                                        <Text style={styles.optionText}>General {categoryInfo?.label}</Text>
                                        {!subcategory && (
                                            <Ionicons name="checkmark" size={20} color="#1e3a5f" />
                                        )}
                                    </Pressable>
                                    {subcategories.map((sub) => (
                                        <Pressable
                                            key={sub}
                                            style={[
                                                styles.option,
                                                subcategory === sub && styles.optionSelected,
                                            ]}
                                            onPress={() => handleSubcategorySelect(sub)}
                                        >
                                            <Text style={styles.optionText}>{sub}</Text>
                                            {subcategory === sub && (
                                                <Ionicons name="checkmark" size={20} color="#1e3a5f" />
                                            )}
                                        </Pressable>
                                    ))}
                                </>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    selectorError: {
        borderColor: '#ef4444',
    },
    selectorDisabled: {
        opacity: 0.5,
    },
    selectorContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    categoryIcon: {
        fontSize: 20,
    },
    selectorText: {
        fontSize: 16,
        color: '#111827',
    },
    placeholderText: {
        color: '#9ca3af',
    },
    errorText: {
        fontSize: 12,
        color: '#ef4444',
        marginTop: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    backButton: {
        padding: 4,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        flex: 1,
        textAlign: 'center',
    },
    optionsList: {
        padding: 16,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        backgroundColor: '#f9fafb',
    },
    optionSelected: {
        backgroundColor: '#e0f2fe',
    },
    optionIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    optionText: {
        fontSize: 16,
        color: '#111827',
        flex: 1,
    },
});

export default CategoryPicker;
