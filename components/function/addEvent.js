import { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection, getDoc, doc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, uploadString } from "firebase/storage"
import { db, storage } from "../../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from 'expo-document-picker'
import Popup from "./popup";

export default function AddEvent({ open, setOpen }) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [group, setGroup] = useState("");
  const [date, setDate] = useState(new Date());

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Empty file");

  const [popup, setPopup] = useState(0);
  const [message, setMessage] = useState("");

  const onSubmit = async() => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const email = await AsyncStorage.getItem("email");

    if (title === "") {
      setMessage("Thiếu tên bài tập");
      setPopup(-1);
      return;
    }

    if (description === "") {
      setMessage("Thiếu nội dung");
      setPopup(-1);
      return;
    }

    if (group === "") {
      setMessage("Thiếu nhóm");
      setPopup(-1);
      return;
    }

    var URL = null;

    if (file !== null) {
      await uploadBytes(ref(storage, email + '/' + fileName), file);
      URL = await getDownloadURL(ref(storage, email + '/' + fileName));
    }

    const groupMemberSnapshot = await getDoc(doc(db, email + '/info/groups/' + group));
    if (!groupMemberSnapshot.exists()) {
      setMessage("Nhóm không tồn tại");
      setPopup(-1);
      return;
    }

    const groupMember = groupMemberSnapshot.data().groupMember.filter((value, index) => { return value.email !== email });
    groupMember.push({ email: email, name: "" });

    const promise = await groupMember.map(async(value, index) => {
      const email = value.email;
      return await addDoc(collection(db, email + '/info/events'), { title, description, group, year, month, day, URL, fileName })
    })

    Promise.all(promise).then((response) => {
      console.log(response);
      setPopup(1);
    }).catch((error) => {
      console.log(error);
    })
  }

  const onChange = (e, setState) => {
    setState(e);
  }

  const getFile = async() => {
    const documentResult = await DocumentPicker.getDocumentAsync({});
    if (documentResult.type === 'cancel') {
      setFileName("Empty file");
      setFile(null);
    } else {
      setFileName(documentResult.name);
      const response = await fetch(documentResult.uri);
      const blob = await response.blob();
      setFile(blob);
    }
  }

  return (
    <>
      {popup === 0 &&
        <View style={styles.container}>
          <View style={styles.titleTextInputView}>
            <TextInput style={styles.titleTextInput} placeholder="  Tiêu đề" onChangeText={(e) => onChange(e, setTitle)} />     
          </View>
          <View style={styles.descriptionTextInputView}>
            <TextInput style={styles.descriptionTextInput} placeholder="  Nội dung" onChangeText={(e) => onChange(e, setDescription)} />
          </View>
          <View style={styles.groupTextInputView}>
            <TextInput style={styles.groupTextInput} placeholder="  Nhóm" onChangeText={(e) => onChange(e, setGroup)} />
          </View>
          <DateTimePicker value={date} onChange={(e, date) => onChange(date, setDate)}/>
          <TouchableOpacity style={styles.fileTouchableOpacity} activeOpacity={0.5} onPress={() => getFile()}>
            <Text style={{
              fontFamily: 'Philosopher-Regular',
              fontSize: 17.5
            }}>{fileName}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitTouchableOpacity} activeOpacity={0.5} onPress={() => onSubmit()}>
            <Text style={{
              fontFamily: 'Philosopher-Regular',
              fontSize: '20'
            }}>Gửi</Text>        
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.closeTouchableOpacity}
            activeOpacity={0.5} 
            onPress={() => setOpen({...open, calendar: true, addEvent: false})}
          >
            <Text>X</Text>
          </TouchableOpacity>
        </View>
      }
      {popup !== 0 && 
        <Popup popup={popup} setPopup={setPopup} message={message} setMessage={message} />
      }
    </>
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
    width: '65%',
    backgroundColor: '#E5E0FF',
    marginBottom: '5%',
    borderRadius: '10px'
  },
  titleTextInput: {
    height: '100%',
    width: '100%'
  },  
  descriptionTextInputView: {
    height: '7.5%',
    width: '65%',
    backgroundColor: '#E5E0FF',
    marginBottom: '5%',
    borderRadius: '10px'
  },
  descriptionTextInput: {
    height: '100%',
    width: '100%'
  },
  groupTextInputView: {
    height: '7.5%',
    width: '65%',
    backgroundColor: '#E5E0FF',
    marginBottom: '5%',
    borderRadius: '10px'
  },
  groupTextInput: {
    height: '100%',
    width: '100%'
  },
  fileTouchableOpacity: {
    height: '7.5%',
    width: '65%',
    backgroundColor: '#E5E0FF',
    borderRadius: '10px',
    marginTop: '5%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitTouchableOpacity: {
    height: '5%',
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
    height: '5%',
    aspectRatio: '1:1',
    borderRadius: '10px',
    backgroundColor: '#F55050',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: '5%',
  }
})