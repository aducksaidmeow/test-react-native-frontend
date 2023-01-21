import { useEffect, useState } from "react"
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native"
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
    <View style={styles.container}>
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
    overflow: 'hidden',
    marginTop: '10%'
  },
  groupTouchableOpacity: {
    height: '7.5%',
    width: '60%',
    backgroundColor: '#D3756B',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '5px'
  },
  memberContainer: {
    height: '5%',
    width: '50%',
    backgroundColor: '#E3ACF9',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: '5px'
  },
  closeTouchableOpacity: {
    height: '5%',
    width: '30%',
    borderRadius: '10px',
    backgroundColor: '#F55050',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5%'
  }
})