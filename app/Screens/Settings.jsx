import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Dialog from 'react-native-dialog'
import * as SecureStore from 'expo-secure-store';
import MyButton from '../components/MyButton';

const Settings = ({ navigation }) => {
    const [port, setPort] = useState()
    const [ip, setIp] = useState()
    const [visibility, setVisibility] = useState(false)
    const showDialog = () => {
        setVisibility(true)
    }
    const handleCancel = () => {
        setVisibility(false)
    }
    const handleOk = async () => {
        setVisibility(false)
        const settings = JSON.stringify(
            {
                ip: ip,
                port: port
            }
        )
        await SecureStore.setItemAsync('settings',settings)
        navigation.navigate('Notes', { refresh: true })
    }
    useEffect(() => {
        const loadSettings = async () => {
            let temp = await SecureStore.getItemAsync('settings')
            if (temp) {
                let settings = JSON.parse(temp)
                setPort(settings.port)
                setIp(settings.ip)
            }
        }
        loadSettings()
    }, [navigation])
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Obecnie zapisane IP:</Text>
            <Text style={[styles.text,{color:'#00d0f4'}]}>{ip}</Text>
            <Text style={styles.text}>Obecnie zapisany PORT</Text>
            <Text style={[styles.text,{color:'#00d0f4'}]}>{port}</Text>
            <MyButton text='Zapisz' background='#00d0f4' fun={showDialog} textColor={'white'}/>
            <Dialog.Container visible={visibility}>
                <Dialog.Title>Zapis IP i Portu serwera do uploadu</Dialog.Title>
                <Dialog.Description>Zapisać?</Dialog.Description>
                <Dialog.Input placeholder='IP' onChangeText={setIp} keyboardType='numeric'/>
                <Dialog.Input placeholder='PORT' onChangeText={setPort} keyboardType='numeric'/>
                <Dialog.Button label="Anuluj" onPress={_ => handleCancel()} style={{ color: '#ff0000' }} />
                <Dialog.Button label="Zapisz" onPress={_ => handleOk()} style={{ color: '#00bafa' }} />
            </Dialog.Container>
        </View>
    )
}

export default Settings

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 15,
        gap:7
    },
    text:{
        fontSize:18
    }
})