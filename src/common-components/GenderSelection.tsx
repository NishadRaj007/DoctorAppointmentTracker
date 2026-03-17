import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomRadioButton = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => {
    return (
        <TouchableOpacity style={styles.radioButtonContainer} onPress={onPress}>
            <View
                style={[
                    styles.radioButtonCircle,
                    selected && styles.radioButtonCircleSelected,
                ]}
            />
            <Text style={styles.radioButtonLabel}>{label}</Text>
        </TouchableOpacity>
    );
};

interface GenderSelectionProps {
    gender: string;
    setGender: (gender: string) => void;
}

const GenderSelection: React.FC<GenderSelectionProps> = ({ gender, setGender }) => {

    const [selectedGender, setSelectedGender] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Select Gender:</Text>
            <View style={styles.radioButtonGroup}>
                <CustomRadioButton
                    label="Male"
                    selected={gender === 'male'}
                    onPress={() => setGender('male')}
                />
                <CustomRadioButton
                    label="Female"
                    selected={gender === 'female'}
                    onPress={() => setGender('female')}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignContent: 'center',
        width: '90%',
        height: 30,
        borderColor: '#ccc',
        paddingHorizontal: 4,
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: '#888',
    },
    radioButtonGroup: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    radioButtonCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#6B7280',
        marginRight: 10,
        backgroundColor: 'transparent',
    },
    radioButtonCircleSelected: {
        backgroundColor: '#000', // You can change this color
    },
    radioButtonLabel: {
        fontSize: 14,
        color: '#888',
    },
    selectedGender: {
        fontSize: 16,
        // marginTop: 20,
    },
});

export default GenderSelection;
