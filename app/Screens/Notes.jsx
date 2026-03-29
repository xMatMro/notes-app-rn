import { useState, useEffect } from "react";
import Note from "../components/Note";
import * as SecureStore from 'expo-secure-store';
import { View, FlatList, Alert, Appearance, StyleSheet } from "react-native";


const Notes = ({ navigation }) => {
  const [titles, setTitles] = useState([]);
  const DeleteAlert = (title) => {
    Alert.alert('Ostrzeżenie', 'Czy chcesz usunąć tę notatkę?', [
      {
        text: 'Anuluj',
        onPress: () => { },
        style: 'cancel'
      },
      {
        text: 'Usuń',
        onPress: () => deleteNote(title),
        style: 'destructive',

      }
    ],
      {
        cancelable:true,
        onDismiss:()=>{}
      });
  }

  const deleteNote = async (title) => {
    const temp = await SecureStore.getItemAsync("keys")

    if (temp) {
      let deleteTitles = JSON.parse(temp)
      deleteTitles = deleteTitles.filter(e => e != title)
      await SecureStore.setItemAsync("keys", JSON.stringify(deleteTitles))
      await SecureStore.deleteItemAsync(title)
      setTitles(deleteTitles)
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const temp = await SecureStore.getItemAsync("keys");

      if (temp) {
        setTitles(JSON.parse(temp).filter(e => e !== ""));
      }
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* {titles.map((title, idx) => (
        <Note key={idx} title={title} />
      ))} */}
      <FlatList
        data={titles}
        numColumns={2}
        renderItem={({ item, index }) => <Note key={index} title={item} onDelete={() => DeleteAlert(item)} navigation={navigation}/>}
        keyExtractor={item => item}
        style={{ padding: 8 }}
      >
      </FlatList>
      {/* <Alert title={"Alert"} visible={true} message={"Czy chcesz usunąć?"}/> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff'
  }
})


export default Notes