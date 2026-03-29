import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const MyButton = ({background,fun,text,textColor}) => {
  return (
    <TouchableOpacity onPress={_=>fun()} style={{backgroundColor:background,paddingHorizontal:25,paddingVertical:15,borderRadius:50,margin:10,borderColor:'black',borderWidth:2,borderStyle:'solid'}}>
        <Text style={{color:textColor,textAlign:'center'}}>{text}</Text>
    </TouchableOpacity>
  )
}

export default MyButton

const styles = StyleSheet.create({})