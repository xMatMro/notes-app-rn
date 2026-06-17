import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store';
import { TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MyButton from '../components/MyButton';


const Add = ({ navigation }) => {
    const colorPalettes = [
        ['#7188e3', '#5b75d5', '#4a98f0'],
        ['#ff85de', '#d764c3', '#bf4aab'],
        ['#47c4a3', '#37ab8d', '#2b9274'],
        ['#ffd25b', '#f4b83b', '#d79932'],
        ['#ff9c76', '#f17b52', '#d15f3f'],
        ['#8f7efa', '#6d63e2', '#544db9']
    ];
    const [title, setTitle] = useState("")
    const [notes, setNotes] = useState("")
    const [picker, setPicker] = useState(0)
    const [categories, setCategories] = useState([])

    const getRandomColor = (categoryIndex) => {
        const palette = categories && categories.length > 0
            ? colorPalettes[categoryIndex % colorPalettes.length] || colorPalettes.flat()
            : colorPalettes.flat();
        return palette;
    };

    const save = async () => {
        let temp = await SecureStore.getItemAsync("keys");

        let keys = temp ? JSON.parse(temp) : [];
        keys.push(title);
        let date = new Date()
        const color = getRandomColor(picker)
        const fullNote = JSON.stringify(
            {
                notes,
                category: picker,
                color,
                date: date.toISOString().split('T')[0],
                timestamp: date.getTime().toString()
            }
        )
        await SecureStore.setItemAsync(title, fullNote);
        await SecureStore.setItemAsync("keys", JSON.stringify(keys));

        navigation.navigate("Notes");
    };
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            const temp = await SecureStore.getItemAsync("category");

            if (temp) {
                setCategories(JSON.parse(temp));
            }

        });

        return unsubscribe;
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Tytuł</Text>
            <TextInput
                value={title}
                style={styles.input}
                onChangeText={setTitle}
                placeholder='Tytuł'
            />
            <Text style={styles.text}>Treść</Text>
            <TextInput
                value={notes}
                style={styles.input}
                onChangeText={setNotes}
                placeholder='Notatki'
            />
            <Text style={styles.text}>Wybierz kategorię</Text>
            <View style={{ borderWidth: 2, borderColor: 'black', borderStyle: 'solid', margin: 10, borderRadius: 50, paddingHorizontal: 10, backgroundColor: '#ccf6ff' }}>
                <Picker
                    selectedValue={picker}
                    onValueChange={(e, i) => setPicker(e)}
                    style={{ height: 60, minWidth: 140 }}
                >
                    {
                        categories.map((e, i) => (
                            <Picker.Item key={i} value={i} label={e} />
                        ))
                    }
                </Picker>
            </View>

            <MyButton text='Zapisz' background='#ccf6ff' fun={save} textColor='black' />
        </View>
    )
}

export default Add

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 15,
        gap: 8
    },
    input: {
        borderColor: 'black',
        borderWidth: 2,
        borderStyle: 'solid',
        margin: 5,
        color: 'black',
        width: 160,
        borderRadius: 50,
        padding: 15,
        width: '65%'
    },
    text: {
        color: 'black',
        fontSize: 16
    }
})