import { View, Text, Button, StyleSheet, TouchableOpacity, Image } from "react-native"
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
      <TouchableOpacity style={styles.studentTouchableOpacity} activeOpacity={0.5} onPress={() => onPress("Student")}>
        <Image source={require('./student.png')} style={styles.studentImage}/>
        <Text style={{
          fontFamily: 'Philosopher-Bold',
          fontSize: '20'
        }}>Học sinh</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.teacherTouchableOpacity} activeOpacity={0.5} onPress={() => onPress("Teacher")}>
        <Image source={require('./teacher.png')} style={styles.teacherImage}/>
        <Text style={{
          fontFamily: 'Philosopher-Bold',
          fontSize: '20'
        }}>Giáo viên</Text>
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
  teacherImage: {
    height: '35%',
    aspectRatio: '1.52:1',
    marginBottom: '10%'
  },
  teacherTouchableOpacity: {
    height: '35%',
    width: '40%',
    backgroundColor: '#E5E0FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px'
  },
  studentImage: {
    height: '42.5%',
    aspectRatio: '1.125:1',
    marginBottom: '10%'
  },
  studentTouchableOpacity: {
    height: '35%',
    width: '40%',
    backgroundColor: '#E5E0FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    marginRight: '5%'
  }
})