// src/componentes/MenuMarvel.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function MenuMarvel({ navigation }) {
    return (
        <View style={styles.menuContainer}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={styles.buttonText}>Listar</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Original')}
            >
                <Text style={styles.buttonText}>Original</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Perfil')}
            >
                <Text style={styles.buttonText}>Usuario</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Logout')}
            >
                <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    menuContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#121212', // negro oscuro
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#E23636', // rojo Marvel para borde
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: '#1F1F1F', // gris oscuro botón
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#E23636', // rojo borde
    },
    buttonText: {
        color: '#E23636', // rojo Marvel
        fontWeight: 'bold',
        fontSize: 16,
    },
});
