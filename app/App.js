import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import Notes from './Screens/Notes';
import Add from './Screens/Add';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import Foundation from '@expo/vector-icons/Foundation';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Edit from './Screens/Edit';
import Info from './Screens/Info';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import AddCategory from './Screens/AddCategory';
import Ionicons from '@expo/vector-icons/Ionicons';
import Settings from './Screens/Settings';
import Backup from './Screens/Backup';
import CalendarScreen from './Screens/CalendarScreen';

const Drawer = createDrawerNavigator({
  screens: {
    Notes: Notes,
    Add: Add
  }
});

function CustomDrawerContent(props) {
  return (
    <>
      <View style={{ padding: 20, backgroundColor: '#00bafa', borderBottomLeftRadius: 50, borderBottomRightRadius: 0 }}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 17, color: '#fff' }}>Moje notatki</Text>
      </View>
      <DrawerContentScrollView {...props}>

        <DrawerItemList {...props} />

        <DrawerItem
          label="Notatki"
          icon={() => <Foundation name="clipboard-notes" size={24} color="#7188e3" />}
          onPress={() => props.navigation.navigate("Notes")}
        />
        <DrawerItem
          label="Dodaj notatkę"
          icon={() => <FontAwesome6 name="add" size={24} color="#42c08b" />}
          onPress={() => props.navigation.navigate("AddNote")}
        />
        <DrawerItem
          label="Dodaj kategorię"
          icon={() => <MaterialIcons name="category" size={24} color="#b15c97" />}
          onPress={() => props.navigation.navigate("AddCategory")}
        />
        <DrawerItem
          label="BackUp"
          icon={() => <MaterialIcons name="backup" size={24} color="#926ac6" />}
          onPress={() => props.navigation.navigate("BackUp")}
        />
        <DrawerItem
          label="Kalendarz"
          icon={() => <Ionicons name="calendar" size={24} color="#ff85de" />}
          onPress={() => props.navigation.navigate("Calendar")}
        />
        <DrawerItem
          label="Ustawienia"
          icon={() => <Ionicons name="settings-sharp" size={24} color="#374955" />}
          onPress={() => props.navigation.navigate("Settings", { refresh: true })}
        />

        <DrawerItem
          label="Info"
          icon={() => <MaterialIcons name="info" size={24} color="#46a2f4" />}
          onPress={() => Alert.alert('Info', 'Notes app v1.3.0', [
            {
              text: 'OK',
              onPress: () => { }
            }
          ],
            {
              cancelable: true,
              onDismiss: () => { }
            })}
        />


      </DrawerContentScrollView>
    </>

  );
}


export default function App() {
  useEffect(() => {
    const categoryFun = async () => {
      let category = await SecureStore.getItemAsync("category")
      if (!category) {
        let tab = ["Ogólne", "Test"]
        await SecureStore.setItemAsync("category", JSON.stringify(tab))
      }

    }
    categoryFun()
  }, [])
  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#00bafa' }} edges={['top', 'right', 'left']}>
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
          <Drawer.Screen name="Notes" component={Notes} options={{
            title: "Notatki",
            drawerItemStyle: { display: 'none' },
            headerStyle: {
              backgroundColor: '#00bafa'
            },
            headerTintColor: "#ffffff"
          }} />
          <Drawer.Screen name="AddNote" component={Add} options={{
            title: "Dodaj notatkę",
            drawerItemStyle: { display: 'none' },
            headerStyle: {
              backgroundColor: '#00bafa'
            },
            headerTintColor: "#ffffff"
          }} />
          <Drawer.Screen name="Edit" component={Edit} options={{
            title: "Edytuj",
            drawerItemStyle: { display: 'none' },
            headerStyle: {
              backgroundColor: '#00bafa'
            },
            headerTintColor: "#ffffff"
          }} />
          <Drawer.Screen name="Info" component={Info} options={{
            title: "Info",
            drawerItemStyle: { display: 'none' },
            headerStyle: {
              backgroundColor: '#00bafa'
            },
            headerTintColor: "#ffffff"
          }} />
          <Drawer.Screen name="AddCategory" component={AddCategory} options={{
            title: "Dodaj kategorię",
            drawerItemStyle: { display: 'none' },
            headerStyle: {
              backgroundColor: '#00bafa'
            },
            headerTintColor: "#ffffff"
          }} />
          <Drawer.Screen name="Settings" component={Settings} options={{
            title: "Ustawienia",
            drawerItemStyle: { display: 'none' },
            headerStyle: {
              backgroundColor: '#00bafa'
            },
            headerTintColor: "#ffffff"
          }} />
          <Drawer.Screen name="BackUp" component={Backup} options={{
            title: "Zrób BackUp",
            drawerItemStyle: { display: 'none' },
            headerStyle: {
              backgroundColor: '#00bafa'
            },
            headerTintColor: "#ffffff"
          }} />
          <Drawer.Screen name="Calendar" component={CalendarScreen} options={{
            title: "Kalendarz",
            drawerItemStyle: { display: 'none' },
            headerStyle: {
              backgroundColor: '#00bafa'
            },
            headerTintColor: "#ffffff"
          }} />
        </Drawer.Navigator>
      </SafeAreaView >
    </NavigationContainer>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
