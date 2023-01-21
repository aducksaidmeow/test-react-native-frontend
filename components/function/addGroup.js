import { Button, View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
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
    <View style={styles.container}>
      <View style={styles.groupNameTextInputView}>
        <TextInput style={styles.groupNameTextInput} placeholder="  Group name" onChangeText={(e) => setGroupName(e)}/>
      </View>
      {groupMember.map((value, index) => {
        return (
          <View style={styles.memberContainer} key={key[index]}>
            <View style={styles.emailTextInputView}>
              <TextInput style={styles.emailTextInput} placeholder="  Email" onChangeText={(e) => onChange(e, index, "email")}/>
            </View>
            <View style={styles.nameTextInputView}>
              <TextInput style={styles.nameTextInput} placeholder=" Name" onChangeText={(e) => onChange(e, index, "name")}/>
            </View>
            {index < 50 && index === groupMember.length - 1 && 
              <TouchableOpacity style={styles.addMemberTouchableOpacity} activeOpacity={0.5} onPress={() => onAdding()}>
                <Text>+</Text>  
              </TouchableOpacity>
            }
            {groupMember.length > 1 && 
              <TouchableOpacity style={styles.deleteMemberTouchableOpacity} activeOpacity={0.5} onPress={() => onDeleting(index)}>
                <Text>-</Text>
              </TouchableOpacity>
            }
          </View>
        )
      })}
      <TouchableOpacity style={styles.submitTouchableOpacity} activeOpacity={0.5} onPress={() => onSubmit()}> 
        <Text>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.closeTouchableOpacity} 
        activeOpacty={0.5} 
        onPress={() =>  setOpen({...open, calendar: true, addGroup: false})}
      >
        <Text>Close</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'hidden'
  },
  groupNameTextInputView: {
    height: '7.5%',
    width: '50%',
    backgroundColor: '#84D2C5',
    marginBottom: '5%',
    borderRadius: '10px',
    marginTop: '10%'
  },
  groupNameTextInput: {
    height: '100%',
    width: '100%'
  },
  memberContainer: {
    height: '7.5%',
    width: '85%',
    //backgroundColor: '#F273E6',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: '2.5%'
  },
  emailTextInputView: {
    height: '100%',
    width: '35%',
    backgroundColor: '#84D2C5',
    borderRadius: '5px',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '2.5%'
  },
  emailTextInput: {
    height: '100%',
    width: '100%'
  },
  nameTextInputView: {
    height: '100%',
    width: '35%',
    backgroundColor: '#84D2C5',
    borderRadius: '5px',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '2.5%'
  },
  nameTextInput: {
    height: '100%',
    width: '100%'
  },
  addMemberTouchableOpacity: {
    height: '70%',
    width: '12.5%',
    backgroundColor: '#03C988',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    marginRight: '2.5%'
  },
  deleteMemberTouchableOpacity: {
    height: '70%',
    width: '12.5%',
    backgroundColor: '#CD0404',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px'
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