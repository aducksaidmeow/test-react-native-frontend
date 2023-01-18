import { useEffect, useState } from "react"
import { View, Text, Button } from "react-native"
import { db } from "../../firebaseConfig"
import { getDocs, collection } from "firebase/firestore"
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DisplayGroup({ open, setOpen }) {

  const [groupList, setGroupList] = useState([]);
  const [openList, setOpenList] = useState([]);

  useEffect(() => {
    const getGroupList = async() => {
      const email = await AsyncStorage.getItem("email");
      const list = await getDocs(collection(db, email + '/info/groups'));
      list.forEach((doc) => {
        setGroupList((groupList) => { return [...groupList, doc.data()] });
        setOpenList((openList) => { return [...openList, false] });
      })
    }
    getGroupList();
  }, [])

  const onPress = (index) => {
    const newOpenList = [...openList];
    newOpenList[index] = !newOpenList[index];
    setOpenList(newOpenList);
  }

  return (
    <View>
      {groupList.map((value, index) => {
        return (
          <View key={index}>
            <Button title={value.groupName} onPress={() => onPress(index)}/>
            {openList[index] && value.groupMember.map((value, index) => {
              return (
                <View>
                  <Text>
                    {value.email}
                  </Text>
                </View>
              )
            })}
          </View>
        )
      })}
      <Button title={"Close"} onPress={() => setOpen({...open, calendar: true, displayGroup: false })}/>
    </View>
  )
}