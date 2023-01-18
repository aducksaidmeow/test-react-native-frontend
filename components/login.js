import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { setDoc, doc } from "firebase/firestore"
import { db } from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }) {

  const [openLogin, setOpenLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onChangeText = (e, setState) => {
    setState(e);
  }

  const authenticate = async() => {
    await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
      console.log(userCredential);
    }).catch((error) => {
      console.log(error);
    })
    await signInWithEmailAndPassword(auth, email, password).then(async(userCredential) => {

      const refreshToken = userCredential._tokenResponse.refreshToken;
      await AsyncStorage.setItem("refreshToken", refreshToken);

      const uid = userCredential.user.uid;
      await AsyncStorage.setItem("uid", uid);

      const email = userCredential.user.email;
      await AsyncStorage.setItem("email", email);

      const ref = doc(db, email + '/info');
      setDoc(ref, { uid }, { merge: true }).then((response) => {
        console.log(response);
      }).catch((error) => {
        console.log(error);
      });

      navigation.navigate("AddInfo");
    }).catch((error) => {
      console.log(error);
    })
  }

  return (
    <View>
      {!openLogin && 
        <Button title={"Login"} onPress={() => setOpenLogin(true)}/> 
      }
      {openLogin && 
        <View>
          <TextInput placeholder="Gmail" onChangeText={(e) => onChangeText(e, setEmail)}/>
          <TextInput placeholder="Password" onChangeText={(e) => onChangeText(e, setPassword)}/>
          <Button title={"Submit"} onPress={() => authenticate()} />
          <Button title={"Close"} onPress={() => setOpenLogin(false)} />
        </View>
      }
    </View>
  )
}