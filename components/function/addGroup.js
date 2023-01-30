import { Button, View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { addDoc, collection, doc, setDoc } from "firebase/firestore"
import { db } from "../../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Popup from "./popup";

export default function AddGroup({ open, setOpen }) {

  const [groupName, setGroupName] = useState("")
  const [groupMember, setGroupMember] = useState([{ email: "", name: "" }])
  const [key, setKey] = useState([0]);
  const [counter, setCounter] = useState(1);

  const [popup, setPopup] = useState(0);
  const [message, setMessage] = useState("");

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

    if (groupName === "") {
      setMessage("Thiếu tên nhóm");
      setPopup(-1);
      return;
    }

    if (groupName.includes("/")) {
      setMessage("Tên nhóm không được chứa dấu /");
      setPopup(-1);
      return;
    }

    var missingEmail = false;
    var missingName = false;

    groupMember.forEach((value, index) => {
      if (value.email === "") {
        missingEmail = true;
      }
      if (value.name === "") {
        missingName = true;
      }
    })

    if (missingEmail) {
      setMessage("Thiếu email thành viên");
      setPopup(-1);
      return;
    }

    if (missingName) {
      setMessage("Thiếu tên thành viên");
      setPopup(-1);
      return;
    }

    const email = await AsyncStorage.getItem("email");
    const ref = doc(db, email + '/info/groups/' + groupName);
    setDoc(ref, { groupMember, groupName }).then((response) => {
      console.log(response);
      setPopup(1);
    }).catch((error) => {
      console.log(error);
    })
  }

  return (
    <>
      {popup === 0 && 
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.groupNameTextInputView}>
            <TextInput style={styles.groupNameTextInput} placeholder="  Tên nhóm" onChangeText={(e) => setGroupName(e)}/>
          </View>
          {groupMember.map((value, index) => {
            return (
              <View style={styles.memberContainer} key={key[index]}>
                <View style={styles.emailTextInputView}>
                  <TextInput style={styles.emailTextInput} placeholder="  Email" onChangeText={(e) => onChange(e, index, "email")}/>
                </View>
                <View style={styles.nameTextInputView}>
                  <TextInput style={styles.nameTextInput} placeholder=" Tên" onChangeText={(e) => onChange(e, index, "name")}/>
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
            <Text style={{
              fontFamily: 'Philosopher-Regular',
              fontSize: 20,
            }}>Gửi</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.closeTouchableOpacity} 
            activeOpacty={0.5} 
            onPress={() =>  setOpen({...open, calendar: true, addGroup: false})}
          >
            <Text>X</Text>
          </TouchableOpacity>
        </ScrollView>
      }
      {popup !== 0 && 
        <Popup popup={popup} setPopup={setPopup} message={message} setMessage={setMessage} /> 
      }
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  contentContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  groupNameTextInputView: {
    height: 50,
    width: '65%',
    backgroundColor: '#A6D1E6',
    marginBottom: '5%',
    borderRadius: '10px',
    marginTop: '10%'
  },
  groupNameTextInput: {
    height: '100%',
    width: '100%'
  },
  memberContainer: {
    height: 50,
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
    backgroundColor: '#A6D1E6',
    borderRadius: '7.5px',
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
    backgroundColor: '#A6D1E6',
    borderRadius: '7.5px',
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
    aspectRatio: '1:1',
    backgroundColor: '#03C988',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    marginRight: '2.5%'
  },
  deleteMemberTouchableOpacity: {
    height: '70%',
    aspectRatio: '1:1',
    backgroundColor: '#CD0404',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px'
  },
  submitTouchableOpacity: {
    height: 45,
    //width: '40%',
    aspectRatio: '2:1',
    borderRadius: '10px',
    backgroundColor: '#FFD4D4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '5%',
    marginTop: '5%'
  },
  closeTouchableOpacity: {
    height: 35,
    aspectRatio: '1:1',
    borderRadius: '10px',
    backgroundColor: '#F55050',
    justifyContent: 'center',
    alignItems: 'center',
  }
})