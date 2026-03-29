import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const Note = ({ title, onDelete, navigation }) => {
  const [note, setNote] = useState("");
  const [opt, setOpt] = useState();

  useEffect(() => {
    const getNote = async () => {
      const temp = await SecureStore.getItemAsync(title);
      const categoryTemp = await SecureStore.getItemAsync('category')
      const categoryTab = JSON.parse(categoryTemp)
      let tab = JSON.parse(temp)
      setNote(tab.notes)
      setOpt(categoryTab[tab.category])
    };

    getNote();
  }, [title]);

  return (
    <TouchableOpacity onLongPress={onDelete} style={styles.note} onPress={_ => navigation.navigate("Edit", {
      title: title
    })}>
      <View style={styles.optView}>
        <Text style={{ color: 'white', textAlign: 'center', borderRadius: 15 }}>{opt}</Text>
      </View>
      <Text style={[styles.text,{fontWeight:'bold',fontSize:17}]}>Tytuł: {title}</Text>
      <Text style={styles.text}>Treść: {note}</Text>
    </TouchableOpacity>
  );
};

export default Note
const styles = StyleSheet.create({
  note: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#7188e3',
    margin: 10,
    padding: 10,
    borderColor: '#9568f0',
    borderWidth: 4,
    borderStyle: 'solid',
  },
  text: {
    color: '#fff',
    textAlign: 'center'
  },
  optView: {
    backgroundColor: '#46a2f4',
    borderRadius: 15,
    padding: 8,
    alignSelf: 'left',
    width: 80,
    borderColor: '#0085c1',
    borderWidth: 2,
    borderStyle: 'solid',
    marginBottom: 10
  }
})