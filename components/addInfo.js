import { View, Text, Button } from "react-native"
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
    <View>
      <Button title={"Teacher"} onPress={() => onPress("Teacher")}/>
      <Button title={"Student"} onPress={() => onPress("Student")}/>
    </View>
  )
}