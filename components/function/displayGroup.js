import { useEffect, useState } from "react"
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {groupList.map((value, index) => {
        return (
          <>
            <TouchableOpacity 
              style={styles.groupTouchableOpacity} 
              activeOpacity={0.5} 
              onPress={() => onPress(index)}
              key={index}
            >
              <Text>{value.groupName}</Text>             
            </TouchableOpacity>
            {openList[index] && value.groupMember.map((value, index) => {
              return (
                <View style={styles.memberContainer} key={index}>
                  <Text>
                    {value.email}
                  </Text>
                </View>
              )
            })}
          </>
        )
      })}
      <TouchableOpacity 
        style={styles.closeTouchableOpacity}
        activeOpacity={0.5} 
        onPress={() => setOpen({...open, calendar: true, displayGroup: false })}
      >
        <Text>X</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  groupTouchableOpacity: {
    height: 50,
    width: '65%',
    backgroundColor: '#BFEAF5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '5px'
  },
  memberContainer: {
    height: 30,
    width: '55%',
    backgroundColor: '#E3F6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '5px'
  },
  closeTouchableOpacity: {
    height: 35,
    //width: '30%',
    aspectRatio: '1:1',
    borderRadius: '10px',
    backgroundColor: '#F55050',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  }
})