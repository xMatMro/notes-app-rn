import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store';
import MyButton from '../components/MyButton';

const Backup = ({ navigation }) => {
  const [ip, setIp] = useState()
  const [port, setPort] = useState()
  useEffect(() => {
    const loadSettings = async () => {
      let temp = await SecureStore.getItemAsync('settings')
      if (temp) {
        let settings = JSON.parse(temp)
        setIp(settings.ip)
        setPort(settings.port)
      }
    }
    loadSettings()
  }, [navigation])
  const save = async () => {
    let temp = await SecureStore.getItemAsync('keys')
    let keys = temp ? JSON.parse(temp) : []
    const items = await Promise.all(keys.map(async (e, i) => {
      let tempNote = await SecureStore.getItemAsync(e)
      tempNote = JSON.parse(tempNote)
      const note = tempNote.notes
      const category = tempNote.category
      return { title: e, note: note, category: category }

    }))
    await fetch('http://' + ip + ':' + port + '/api/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: items
      })
    }).then(res => {
      if (res.status == 200) {
        Alert.alert('Sukces!', 'BackUp wykonany', [{
          text: 'Ok',
          onPress: () => navigation.navigate('Notes')
        }], {
          onDismiss: () => navigation.navigate('Notes')
        })
      }
      else {
        Alert.alert('Error', 'BackUp nie został wykonany, błąd serwera', [{
          text: 'Ok',
          onPress: () => navigation.navigate('Notes')
        }], {
          onDismiss: () => navigation.navigate('Notes')
        })
      }
    })
  }
  const get = async () => {
    const items = await fetch('http://' + ip + ':' + port + '/api/get').then(res => res.json())
    let keys = await SecureStore.getItemAsync('keys')
    keys = JSON.parse(keys)
    keys.forEach(async(key) => {
      await SecureStore.deleteItemAsync(key)
    });
    keys = []
    keys = items.map(e=>{
      return e.title
    })
    console.log(keys)
    await SecureStore.setItemAsync('keys',JSON.stringify(keys))
    items.forEach(async(item)=>{
      await SecureStore.setItemAsync(item.title,JSON.stringify({notes:item.note,category:item.category}))
    })
    navigation.navigate('Notes',{
      refresh:true
    })
  }
  return (
    <View style={styles.container}>
      <MyButton text='Zrób BackUp' background='#00e2da' fun={save} textColor={'white'}/>
      <MyButton text='Wczytaj BackUp' background='#00e2da' fun={get} textColor={'white'}/>
    </View>
  )
}

export default Backup

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 15
  }
})