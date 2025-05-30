import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const personajes = [
    {
        nombre: "Spider-Man",
        pistas: [
            "Vive en Queens, Nueva York.",
            "Es un adolescente con sentido arácnido.",
            "Usa un traje rojo y azul con telarañas.",
        ],
    },
    {
        nombre: "Black Panther",
        pistas: [
            "Es rey de una nación africana muy avanzada.",
            "Su traje es de vibranio.",
            "Pertenece a Wakanda.",
        ],
    },
    {
        nombre: "Scarlet Witch",
        pistas: [
            "Tiene poderes mentales y mágicos.",
            "Es hermana de Quicksilver.",
            "Su verdadero nombre es Wanda Maximoff.",
        ],
    },
    {
        nombre: "Loki",
        pistas: [
            "Es el Dios del Engaño.",
            "Hermano adoptivo de Thor.",
            "Puede cambiar de forma y crear ilusiones.",
        ],
    }
];

export default function AdivinaPersonaje() {
    const [indice, setIndice] = useState(0);
    const [pistaIndex, setPistaIndex] = useState(0);
    const [mensaje, setMensaje] = useState("");
    const [respondido, setRespondido] = useState(false);

    const personaje = personajes[indice];

    const responder = (opcion) => {
        if (respondido) return;
        if (opcion === personaje.nombre) {
            setMensaje("✅ ¡Correcto! Era " + personaje.nombre);
        } else {
            setMensaje("❌ Incorrecto. Era " + personaje.nombre);
        }
        setRespondido(true);
        setTimeout(() => {
            setIndice((prev) => (prev + 1) % personajes.length);
            setPistaIndex(0);
            setMensaje("");
            setRespondido(false);
        }, 2500);
    };

    const siguientePista = () => {
        if (pistaIndex < personaje.pistas.length - 1) {
            setPistaIndex(pistaIndex + 1);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>🕵️‍♂️ ¿Quién es este personaje?</Text>
            <Text style={styles.pista}>🔎 Pista: {personaje.pistas[pistaIndex]}</Text>

            <TouchableOpacity style={styles.pistaBtn} onPress={siguientePista}>
                <Text style={styles.pistaTexto}>👉 Ver otra pista</Text>
            </TouchableOpacity>

            <View style={styles.opciones}>
                {personajes.map((p, i) => (
                    <TouchableOpacity
                        key={i}
                        style={styles.boton}
                        onPress={() => responder(p.nombre)}
                        disabled={respondido}
                    >
                        <Text style={styles.textoBoton}>{p.nombre}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {mensaje !== "" && <Text style={styles.mensaje}>{mensaje}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0d1117',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#e62429',
        marginBottom: 20,
    },
    pista: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    pistaBtn: {
        marginBottom: 20,
        padding: 8,
        backgroundColor: '#30363d',
        borderRadius: 6,
    },
    pistaTexto: {
        color: '#58a6ff',
        fontWeight: 'bold',
    },
    opciones: {
        width: '100%',
    },
    boton: {
        backgroundColor: '#161b22',
        borderColor: '#e62429',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 10,
        marginVertical: 6,
        alignItems: 'center',
    },
    textoBoton: {
        color: '#ffffff',
        fontSize: 16,
    },
    mensaje: {
        marginTop: 20,
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
    },
});
