import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native"
import { db } from "../firebaseConfig"
import { doc, setDoc } from "firebase/firestore"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function AddInfo({ navigation }) {

  const onPress = async(role) => {
    const email = await AsyncStorage.getItem("email");
    const ref = doc(db, email + '/info');
    setDoc(ref, { role }, { merge: true }).then((response) => {
      if (role === "Teacher") navigation.navigate("TeacherCalendar");
      else navigation.navigate("StudentCalendar");
    }).catch((error) => {
      console.log(error);
    })
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.teacherTouchableOpacity} activeOpacity={0.5} onPress={() => onPress("Teacher")}>
        <Text>Teacher</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.studentTouchableOpacity} activeOpacity={0.5} onPress={() => onPress("Student")}>
        <Text>Student</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#FFF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  teacherTouchableOpacity: {
    height: '7.5%',
    width: '40%',
    backgroundColor: '#C27664',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '5%',
    borderRadius: '10px'
  },
  studentTouchableOpacity: {
    height: '7.5%',
    width: '40%',
    backgroundColor: '#C27664',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px'
  }
})