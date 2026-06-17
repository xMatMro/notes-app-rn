import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { use, useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store';
import { Picker } from '@react-native-picker/picker';
import MyButton from '../components/MyButton';

const Edit = ({ navigation, route }) => {
  const title = route.params.title
  const [categories, setCategories] = useState([])
  const [newTitle, setNewTitle] = useState()
  const [note, setNote] = useState()
  const [picker, setPicker] = useState(0)
  const [color, setColor] = useState('#7188e3')
  const [date, setDate] = useState('')
  const [timestamp, setTimestamp] = useState('')
  useEffect(() => {
    const loadData = async () => {
      const categoryTemp = await SecureStore.getItemAsync('category')
      setCategories(JSON.parse(categoryTemp))
      const noteTemp = await SecureStore.getItemAsync(title)
      const noteLoaded = JSON.parse(noteTemp)
      setNote(noteLoaded.notes)
      setPicker(noteLoaded.category)
      setNewTitle(title)
      setColor(noteLoaded.color || '#7188e3')
      setDate(noteLoaded.date || '')
      setTimestamp(noteLoaded.timestamp || new Date().getTime().toString())
    }
    loadData()
  }, [title])
  const save = async () => {
    await SecureStore.deleteItemAsync(title)
    const temp = await SecureStore.getItemAsync('keys')
    let keys = temp ? JSON.parse(temp).filter(e => e !== "") : [];
    keys = keys.filter(e => e != title)
    keys.push(newTitle)
    const fullNote = JSON.stringify(
      {
        notes: note,
        category: picker,
        color,
        date,
        timestamp
      }

    )
    await SecureStore.setItemAsync(newTitle, fullNote)
    await SecureStore.setItemAsync('keys', JSON.stringify(keys))
    navigation.navigate('Notes', { refresh: true })
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tytuł</Text>
      <TextInput
        style={styles.input}
        placeholder='Tytuł'
        value={newTitle}
        onChangeText={setNewTitle}
      />
      <Text style={styles.text}>Treść</Text>
      <TextInput
        style={styles.input}
        placeholder='Treść'
        value={note}
        onChangeText={setNote}
      />
      <Text style={styles.text}>Wybierz kategorię</Text>
      <View style={{borderWidth:2,borderColor:'black',borderStyle:'solid',margin:10,borderRadius:50,paddingHorizontal:10,backgroundColor:'#ccf6ff'}}>
        <Picker
          selectedValue={picker}
          onValueChange={(e, i) => setPicker(e)}
          style={{ height: 55, minWidth: 140}}
        >
          {categories.map((e, i) => (
            <Picker.Item key={i} value={i} label={e} />
          ))}
        </Picker>
      </View>

      <MyButton text='Zapisz' background='#ccf6ff' fun={save} textColor={'black'} />
    </View>
  )
}

export default Edit

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    gap: 8
  },
  input: {
    borderColor: '#000',
    borderWidth: 2,
    borderStyle: 'solid',
    margin: 5,
    color: '#000',
    width: 160,
    borderRadius: 50,
    padding: 15,
    width: '65%'
  },
  text:{
    fontSize:16
  }
})