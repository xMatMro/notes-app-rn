import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store';
import { TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MyButton from '../components/MyButton';


const Add = ({ navigation }) => {

    const [title, setTitle] = useState("")
    const [notes, setNotes] = useState("")
    const [picker, setPicker] = useState(0)
    const [categories, setCategories] = useState([])
    const save = async () => {
        let temp = await SecureStore.getItemAsync("keys");
        console.log('h')

        let keys = temp ? JSON.parse(temp) : [];
        console.log('f')
        keys.push(title);
        console.log('d')
        const fullNote = JSON.stringify(
            {
                notes,
                category: picker
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
            <View style={{borderWidth:2,borderColor:'black',borderStyle:'solid',margin:10,borderRadius:50,paddingHorizontal:10,backgroundColor:'#ccf6ff'}}>
                <Picker
                    selectedValue={picker}
                    onValueChange={(e, i) => setPicker(e)}
                    style={{ height: 55, minWidth: 140 }}
                >
                    {
                        categories.map((e, i) => (
                            <Picker.Item key={i} value={i} label={e} />
                        ))
                    }
                </Picker>
            </View>

            <MyButton text='Zapisz' background='#ccf6ff' fun={save} textColor='black'/>
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
        gap:8
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
        width:'65%'
    },
    text: {
        color: 'black',
        fontSize:16
    }
})