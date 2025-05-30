import React, { useState } from 'react';
import {
    View,
    TextInput,
    Button,
    Text,
    StyleSheet,
    Alert,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function Registro() {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [fecha, setFecha] = useState('');
    const [telefono, setTelefono] = useState('');
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    const ganados = 0;
    const perdidos = 0;

    const handleRegistro = async () => {
        setError(null);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
            const user = userCredential.user;

            await setDoc(doc(db, 'usuarios', user.uid), {
                uid: user.uid,
                nombre,
                correo,
                fecha,
                telefono,
                ganados,
                perdidos,
            });

            Alert.alert('Éxito', 'Usuario registrado correctamente');
            navigation.navigate('Login');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Registro</Text>

            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
            />
            <TextInput
                style={styles.input}
                placeholder="Correo"
                value={correo}
                onChangeText={setCorreo}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={contrasena}
                onChangeText={setContrasena}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Fecha de nacimiento (YYYY-MM-DD)"
                value={fecha}
                onChangeText={setFecha}
            />
            <TextInput
                style={styles.input}
                placeholder="Teléfono"
                value={telefono}
                onChangeText={setTelefono}
                keyboardType="phone-pad"
            />

            <TouchableOpacity style={styles.button} onPress={handleRegistro}>
                <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>

            {error && <Text style={styles.error}>{error}</Text>}

            <Text style={styles.loginText}>Ya tengo cuenta y quiero loguearme</Text>
            <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'center',
        flexGrow: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 14,
        borderRadius: 6,
        marginBottom: 12,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 14,
        borderRadius: 6,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginText: {
        marginTop: 20,
        fontSize: 14,
        textAlign: 'center',
        color: '#555',
    },
    loginButton: {
        marginTop: 10,
        paddingVertical: 12,
        backgroundColor: '#28a745',
        borderRadius: 6,
    },
    loginButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    },
});
