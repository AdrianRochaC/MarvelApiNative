import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import md5 from 'md5';

// Reemplaza con tus claves reales
const PUBLIC_KEY = 'ca42b51068cea80cd6968e18ea34bbad';
const PRIVATE_KEY = '13a4817820d57088649a8e8801bf1405c06674a0';
const MARVEL_API_BASE = 'https://gateway.marvel.com/v1/public';

const getAuthParams = () => {
  const ts = new Date().getTime();
  const hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY);
  return `ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`;
};

const Listas = () => {
  const [allCharacters, setAllCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState('All');
  const [busqueda, setBusqueda] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Cargando personajes...');

  const heroesKeywords = ['iron', 'captain', 'spider', 'thor', 'hulk', 'america', 'man', 'widow', 'panther', 'marvel', 'hawk', 'vision', 'strange', 'fury', 'wolverine', 'cyclops', 'xavier', 'beast', 'angel'];
  const villainsKeywords = ['thanos', 'loki', 'ultron', 'goblin', 'doom', 'venom', 'magneto', 'skull', 'octopus', 'kingpin', 'mystique', 'apocalypse', 'sinister', 'sentinel', 'carnage', 'juggernaut', 'leader', 'abomination', 'lizard', 'mandarin', 'modok', 'hela', 'kree', 'dormammu', 'evil'];

  const determinarTipo = (character) => {
    const nameLower = character.name.toLowerCase();
    const description = character.description?.toLowerCase() || '';

    if (
      description.includes('villain') ||
      description.includes('enemy') ||
      description.includes('antagonist') ||
      description.includes('foe') ||
      villainsKeywords.some((keyword) => nameLower.includes(keyword))
    ) {
      return 'Villains';
    }

    if (heroesKeywords.some((keyword) => nameLower.includes(keyword))) {
      return 'Heroes';
    }

    const firstLetter = nameLower.charAt(0);
    if (firstLetter >= 'a' && firstLetter <= 'm') {
      return 'Heroes';
    } else if (firstLetter >= 'n' && firstLetter <= 'z') {
      return 'Villains';
    }

    return 'Other';
  };

  const fetchAllCharacters = async (limit = 100) => {
    try {
      let allCharacters = [];
      let offset = 0;
      let total = 1;

      while (offset < total) {
        const url = `${MARVEL_API_BASE}/characters?limit=${limit}&offset=${offset}&${getAuthParams()}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (offset === 0) {
          total = data.data.total;
        }

        allCharacters = [...allCharacters, ...data.data.results];

        offset += limit;

        if (allCharacters.length >= 500) {
          break;
        }
      }

      return allCharacters;
    } catch (error) {
      console.error('Error al obtener personajes:', error);
      return [];
    }
  };

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setIsLoading(true);

        const personajes = await fetchAllCharacters();

        const personajesConTipo = personajes.map((character) => {
          const tipo = determinarTipo(character);
          return { ...character, tipo };
        });

        setAllCharacters(personajesConTipo);
        setFilteredCharacters(personajesConTipo);
      } catch (error) {
        console.error('Error al cargar personajes:', error);
        setLoadingMessage('Error al cargar los personajes. Intenta recargar la página.');
      } finally {
        setIsLoading(false);
      }
    };

    obtenerDatos();
  }, []);

  useEffect(() => {
    if (allCharacters.length === 0) return;

    let resultado = [...allCharacters];

    if (tipoSeleccionado !== 'All') {
      resultado = resultado.filter((character) => character.tipo === tipoSeleccionado);
    }

    if (busqueda.length >= 3) {
      resultado = resultado.filter((character) =>
        character.name.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    setFilteredCharacters(resultado);
  }, [tipoSeleccionado, busqueda, allCharacters]);

  const handleTipoChange = (tipo) => {
    setTipoSeleccionado(tipo);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.buscador}
        placeholder="Buscar Personaje"
        placeholderTextColor="#aaa"
        value={busqueda}
        onChangeText={(text) => setBusqueda(text)}
      />

      <View style={styles.filtroContainer}>
        {['All', 'Heroes', 'Villains'].map((tipo) => (
          <TouchableOpacity key={tipo} onPress={() => handleTipoChange(tipo)}>
            <Text style={[styles.filtroTexto, tipoSeleccionado === tipo && styles.filtroTextoActivo]}>
              {tipo}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tipoSeleccionado !== 'All' && (
        <Text style={styles.filterInfo}>
          Mostrando: {tipoSeleccionado} ({filteredCharacters.length} personajes)
        </Text>
      )}

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>{loadingMessage}</Text>
          <ActivityIndicator size="large" color="#e62429" />
        </View>
      ) : filteredCharacters.length > 0 ? (
        <ScrollView contentContainerStyle={styles.lista}>
          {filteredCharacters.map((character, index) => (
            <View style={styles.characterCard} key={character.id || index}>
              <Text style={styles.characterName}>{character.name}</Text>
              <Image
                source={{ uri: `${character.thumbnail.path}.${character.thumbnail.extension}` }}
                style={styles.characterImage}
                resizeMode="contain"
              />
              <Text style={styles.characterName}>{character.name}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noResults}>No se encontraron personajes que coincidan con los criterios.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    padding: 10,
  },
  buscador: {
    width: '100%',
    padding: 10,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#e62429',
    borderRadius: 5,
    backgroundColor: '#111',
    color: '#fff',
    marginBottom: 10,
  },
  filtroContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  filtroTexto: {
    color: '#fff',
    fontSize: 16,
    marginHorizontal: 10,
  },
  filtroTextoActivo: {
    color: '#e62429',
    fontWeight: 'bold',
  },
  filterInfo: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
    color: '#e62429',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lista: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  characterCard: {
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#e62429',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },
  characterName: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  characterImage: {
    width: '100%',
    height: 100,
    borderRadius: 6,
    marginBottom: 5,
  },
  noResults: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Listas;
