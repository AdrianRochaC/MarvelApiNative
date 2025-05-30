// src/componentes/Perfil.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { auth } from '../../firebase/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

export default function Perfil() {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [fecha, setFecha] = useState('');
    const [telefono, setTelefono] = useState('');
    const [ganados, setGanados] = useState(0);
    const [perdidos, setPerdidos] = useState(0);
    const [cargando, setCargando] = useState(true);

    const uid = auth.currentUser?.uid;

    useEffect(() => {
        if (!uid) return;

        const traerDatos = async () => {
            try {
                const docRef = doc(db, 'usuarios', uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();

                    setNombre(data.nombre || '');
                    setCorreo(data.correo || '');
                    setFecha(data.fecha || '');
                    setTelefono(data.telefono || '');
                    setGanados(data.ganados || 0);
                    setPerdidos(data.perdidos || 0);
                } else {
                    Alert.alert('Usuario no encontrado');
                }
            } catch (error) {
                Alert.alert('Error al obtener datos');
                console.error(error);
            } finally {
                setCargando(false);
            }
        };

        traerDatos();
    }, [uid]);

    const actualizarDatos = async () => {
        if (!uid) return;

        try {
            const docRef = doc(db, 'usuarios', uid);
            await updateDoc(docRef, {
                nombre,
                fecha,
                telefono,
            });
            Alert.alert('Datos actualizados correctamente');
        } catch (error) {
            Alert.alert('Error al actualizar datos');
            console.error(error);
        }
    };

    if (cargando) {
        return (
            <View style={styles.cargandoContenedor}>
                <Text style={styles.cargandoTexto}>Cargando...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.contenedor}>
            <Text style={styles.titulo}>Perfil del Usuario</Text>

            <Text style={styles.label}>Correo (no editable)</Text>
            <Text style={styles.correo}>{correo}</Text>

            <Text style={styles.label}>Nombre</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
            />

            <Text style={styles.label}>Fecha de nacimiento (YYYY-MM-DD)</Text>
            <TextInput
                style={styles.input}
                placeholder="Fecha de nacimiento"
                value={fecha}
                onChangeText={setFecha}
            />

            <Text style={styles.label}>Teléfono</Text>
            <TextInput
                style={styles.input}
                placeholder="Teléfono"
                value={telefono}
                onChangeText={setTelefono}
                keyboardType="phone-pad"
            />

            <View style={styles.estadisticasContenedor}>
                <Text style={styles.estadistica}>Partidas ganadas: {ganados}</Text>
                <Text style={styles.estadistica}>Partidas perdidas: {perdidos}</Text>
            </View>

            <Button title="Guardar cambios" onPress={actualizarDatos} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        padding: 20,
        flexGrow: 1,
        backgroundColor: '#121212',  // Estilo oscuro Marvel
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E23636', // rojo Marvel
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        color: '#fff',
        marginBottom: 6,
        fontWeight: '600',
    },
    correo: {
        color: '#bbb',
        marginBottom: 15,
        fontSize: 16,
    },
    input: {
        backgroundColor: '#222',
        borderColor: '#E23636',
        borderWidth: 1,
        color: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    estadisticasContenedor: {
        marginBottom: 20,
    },
    estadistica: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 4,
    },
    cargandoContenedor: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
    cargandoTexto: {
        color: '#fff',
        fontSize: 18,
    },
});
