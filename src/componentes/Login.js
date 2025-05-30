import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, correo, contrasena);
            navigation.navigate('Home'); // Cambia "Home" si tu pantalla principal se llama distinto
        } catch (error) {
            Alert.alert('Error', 'Usuario o contraseña inválidos');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#aaa"
                value={correo}
                onChangeText={setCorreo}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#aaa"
                value={contrasena}
                onChangeText={setContrasena}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Iniciar sesión</Text>
            </TouchableOpacity>

            <Text style={styles.text}>¿No tienes cuenta?</Text>

            <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
                <Text style={styles.link}>Regístrate</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1c1c',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 28,
        color: '#e62429',
        marginBottom: 25,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: 12,
        marginVertical: 8,
        borderRadius: 8,
        backgroundColor: '#2c2c2c',
        color: '#fff',
        fontSize: 16,
    },
    button: {
        width: '100%',
        padding: 12,
        marginTop: 16,
        backgroundColor: '#e62429',
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    text: {
        color: '#fff',
        marginTop: 20,
    },
    link: {
        color: '#e62429',
        marginTop: 8,
        fontWeight: 'bold',
    },
});
