import { Button, View, StyleSheet, Text, TextInput } from "react-native";
import { useState } from "react";
import { addDoc, collection, doc, setDoc } from "firebase/firestore"
import { db } from "../../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddGroup({ open, setOpen }) {

  const [groupName, setGroupName] = useState("")
  const [groupMember, setGroupMember] = useState([{ email: "", name: "" }])
  const [key, setKey] = useState([0]);
  const [counter, setCounter] = useState(1);

  const onChange = (e, index, position) => {
    const newGroupMember = [...groupMember];
    if (position === "email") {
      newGroupMember[index] = {...newGroupMember[index], email: e.toLowerCase()}
    } else if (position === "name") {
      newGroupMember[index] = {...newGroupMember[index], name: e}
    }
    setGroupMember(newGroupMember);
  }

  const onAdding = () => {
    setCounter(counter + 1);
    setKey([...key, counter]);
    setGroupMember([...groupMember, { email: "", name: "" }]);
  }

  const onDeleting = (index) => {
    const newGroupMember = [...groupMember];
    newGroupMember.splice(index, 1);
    setGroupMember(newGroupMember);

    const newKey = [...key];
    newKey.splice(index, 1);
    setKey(newKey);
  }

  const onSubmit = async() => {
    const email = await AsyncStorage.getItem("email");
    const ref = doc(db, email + '/info/groups/' + groupName);
    setDoc(ref, { groupMember, groupName }).then((response) => {
      console.log(response);
    }).catch((error) => {
      console.log(error);
    })
  }

  return (
    <View>
      <TextInput placeholder="Group name" onChangeText={(e) => setGroupName(e)}/>
      {groupMember.map((value, index) => {
        return (
          <View style={styles.view} key={key[index]}>
            <TextInput style={styles.email} placeholder="email" onChangeText={(e) => onChange(e, index, "email")}/>
            <TextInput style={styles.name} placeholder="name" onChangeText={(e) => onChange(e, index, "name")}/>
            {index < 50 && index === groupMember.length - 1 && 
              <Button title={"Add member"} onPress={() => onAdding()}/>
            }
            {groupMember.length > 1 && 
              <Button title={"Delete member"} onPress={() => onDeleting(index)}/>
            }
          </View>
        )
      })}
      <Button title={"Submit"} onPress={() => onSubmit()}/>
      <Button title={"Close"} onPress={() => setOpen({...open, calendar: true, addGroup: false})}/>
    </View>
  )
}

const styles = StyleSheet.create({
  test: {
    backgroundColor: 'blue',
    height: '100%'
  },
  view: {
    backgroundColor: 'blue',
    flexDirection: 'row'
  },  
  email: {
    backgroundColor: 'red'
  },
  name: {
    backgroundColor: 'yellow'
  }
})