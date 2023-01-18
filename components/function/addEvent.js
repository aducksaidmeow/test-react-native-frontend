import { useState } from "react";
import { View, Text, Button, TextInput } from "react-native";
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
    <View>
      <TextInput placeholder="Title" onChangeText={(e) => onChange(e, setTitle)} />     
      <TextInput placeholder="Description" onChangeText={(e) => onChange(e, setDescription)} />
      <TextInput placeholder="Group" onChangeText={(e) => onChange(e, setGroup)} />
      <DateTimePicker value={date} onChange={(e, date) => onChange(date, setDate)}/>
      <Button title={"Submit"} onPress={() => onSubmit()} />
      <Button title={"Close"} onPress={() => setOpen({...open, calendar: true, addEvent: false})}/>
    </View>
  )
}