import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import * as SecureStore from 'expo-secure-store';
import MyButton from '../components/MyButton';

export default function AddCategory({navigation}) {

    const [newCategory,setNewCategory] = useState('')
    const addCategory = async()=>{
        const temp = await SecureStore.getItemAsync('category')
        const categories = JSON.parse(temp)
        if(newCategory != '' && !categories.includes(newCategory)){
            categories.push(newCategory)
            await SecureStore.setItemAsync('category',JSON.stringify(categories))
            navigation.navigate('Notes')
        }
        else{
            Alert.alert('Błąd','Kategoria jest pusta lub już istnieje',[
                {
                    text:'OK',
                    onPress: () => {navigation.navigate('Notes')},
                    style:'default'
                }
            ])
        }

    }
    return (
        <View style={styles.container}>
            <TextInput
            style={styles.input}
            value={newCategory}
            onChangeText={setNewCategory}
            placeholder='Nowa kategoria'
            />
            <MyButton text='Dodaj kategorię' background='#00e2da' fun={addCategory} textColor={'white'}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems:'center',
        padding:15,
        gap:15
    },
    input: {
        borderColor: 'black',
        borderWidth: 2,
        borderStyle: 'solid',
        margin: 5,
        color: 'black',
        width: 160,
        borderRadius:50,
        padding:15,
        width:'65%'
    }
});