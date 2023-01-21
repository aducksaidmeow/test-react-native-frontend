import { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection, getDoc, doc } from "firebase/firestore"
import { db } from "../../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddEvent({ open, setOpen }) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [group, setGroup] = useState("");
  const [date, setDate] = useState(new Date());

  const onSubmit = async() => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const email = await AsyncStorage.getItem("email");

    const groupMemberSnapshot = await getDoc(doc(db, email + '/info/groups/' + group));
    if (!groupMemberSnapshot.exists()) return;
    const groupMember = groupMemberSnapshot.data().groupMember.filter((value, index) => { return value.email !== email });
    groupMember.push({ email: email, name: "" });

    const promise = await groupMember.map(async(value, index) => {
      const email = value.email;
      return await addDoc(collection(db, email + '/info/events'), { title, description, group, year, month, day })
    })

    Promise.all(promise).then((response) => {
      console.log(response);
    }).catch((error) => {
      console.log(error);
    })
  }

  const onChange = (e, setState) => {
    setState(e);
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleTextInputView}>
        <TextInput style={styles.titleTextInput} placeholder="  Title" onChangeText={(e) => onChange(e, setTitle)} />     
      </View>
      <View style={styles.descriptionTextInputView}>
        <TextInput style={styles.descriptionTextInput} placeholder="  Description" onChangeText={(e) => onChange(e, setDescription)} />
      </View>
      <View style={styles.groupTextInputView}>
        <TextInput style={styles.groupTextInput} placeholder="  Group" onChangeText={(e) => onChange(e, setGroup)} />
      </View>
      <DateTimePicker value={date} onChange={(e, date) => onChange(date, setDate)}/>
      <TouchableOpacity style={styles.submitTouchableOpacity} activeOpacity={0.5} onPress={() => onSubmit()}>
        <Text>Submit</Text>        
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.closeTouchableOpacity}
        activeOpacity={0.5} 
        onPress={() => setOpen({...open, calendar: true, addEvent: false})}
      >
        <Text>Close</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    position: 'relative',
    backgroundColor: '#FFF2F2',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleTextInputView: {
    height: '7.5%',
    width: '50%',
    backgroundColor: '#84D2C5',
    marginBottom: '5%',
    borderRadius: '10px'
  },
  titleTextInput: {
    height: '100%',
    width: '100%'
  },  
  descriptionTextInputView: {
    height: '7.5%',
    width: '50%',
    backgroundColor: '#84D2C5',
    marginBottom: '5%',
    borderRadius: '10px'
  },
  descriptionTextInput: {
    height: '100%',
    width: '100%'
  },
  groupTextInputView: {
    height: '7.5%',
    width: '50%',
    backgroundColor: '#84D2C5',
    marginBottom: '5%',
    borderRadius: '10px'
  },
  groupTextInput: {
    height: '100%',
    width: '100%'
  },
  submitTouchableOpacity: {
    height: '7.5%',
    width: '40%',
    borderRadius: '10px',
    backgroundColor: '#FFD4D4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '5%',
    marginTop: '5%'
  },
  closeTouchableOpacity: {
    height: '5%',
    width: '30%',
    borderRadius: '10px',
    backgroundColor: '#F55050',
    justifyContent: 'center',
    alignItems: 'center',
  }
})