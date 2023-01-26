import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState, useCallback } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { setDoc, doc } from "firebase/firestore"
import { db } from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function Login({ navigation }) {

  const [openLogin, setOpenLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fontsLoaded] = useFonts({
    'Philosopher-Regular': require('../assets/fonts/Philosopher-Regular.otf'),
    'Philosopher-Bold': require('../assets/fonts/Philosopher-Bold.otf'),
  })

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

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
    <View style={styles.container} onLayout={onLayoutRootView}>
      {!openLogin && 
        <>
          <View style={styles.titleView}>
            <Text style={{ 
              fontFamily: 'Philosopher-Bold',
              fontSize: '30' 
            }}>Lịch nhắc nhở học tập</Text>
          </View>
          <TouchableOpacity style={styles.openLoginTouchableOpacity} activeOpacity={0.5} onPress={() => setOpenLogin(true)}>
            <Text style={{
              fontFamily: 'Philosopher-Regular',
              fontSize: '17.5'
            }}>Đăng nhập</Text>
          </TouchableOpacity>
        </>
      }
      {openLogin && 
        <>
          <View style={styles.emailTextInputView}>
            <TextInput style={styles.emailTextInput} placeholder="  Email" onChangeText={(e) => onChangeText(e, setEmail)}/>
          </View>
          <View style={styles.passwordTextInputView}>
            <TextInput style={styles.passwordTextInput} placeholder="  Mật khẩu" onChangeText={(e) => onChangeText(e, setPassword)}/>
          </View>
          <TouchableOpacity style={styles.submitTouchableOpacity} activeOpacity={0.5} onPress={() => authenticate()}>
            <Text style={{
              fontFamily: 'Philosopher-Regular',
              fontSize: '17.5'
            }}>Gửi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeLoginTouchableOpacity} activeOpacity={0.5} onPress={() => setOpenLogin(false)}>
            <Text>X</Text>
          </TouchableOpacity>
        </>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#FFF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  titleView: {
    marginBottom: '5%'
  },
  openLoginTouchableOpacity: {
    height: '5%',
    width: '50%',
    borderRadius: '10px',
    backgroundColor: '#FFD4D4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailTextInputView: {
    height: '7.5%',
    width: '70%',
    backgroundColor: '#E5E0FF',
    borderRadius: '10px',
    marginBottom: '5%',
  },
  emailTextInput: {
    height: '100%',
    width: '100%',
  },
  passwordTextInputView: {
    height: '7.5%',
    width: '70%',
    backgroundColor: '#E5E0FF',
    borderRadius: '10px',
    marginBottom: '5%'
  },
  passwordTextInput: {
    height: '100%',
    width: '80%',
  },
  submitTouchableOpacity: {
    height: '5%',
    //width: '45%',
    aspectRatio: '2:1',
    borderRadius: '10px',
    backgroundColor: '#FFD4D4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20%'
  },
  closeLoginTouchableOpacity: {
    height: '5%',
    //width: '25%',
    aspectRatio: '1:1',
    borderRadius: '10px',
    backgroundColor: '#F55050',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: '5%'
  },
});