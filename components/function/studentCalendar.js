import { useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars"
import { db } from "../../firebaseConfig"
import { getDocs, collection, query, where } from "firebase/firestore"
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from 'expo-linking'

export default function StudentCalendar({ open, setOpen }) {

  const [eventList, setEventList] = useState(Array.from(Array(50), () => new Array(0)));
  const [selectedDay, setSelectedDay] = useState(0);

  const currentDay = (new Date()).getDate();
  const currentMonth = (new Date()).getMonth() + 1;
  const currentYear = (new Date()).getFullYear();

  const getEvent = async(year, month) => {
    setEventList(Array.from(Array(50), () => new Array(0)));
    const email = await AsyncStorage.getItem("email");
    const q = query(
      collection(db, email + '/info/events'), 
      where("month", "==", month), 
      where("year", "==", year)
    );
    const list = await getDocs(q);
    list.forEach((doc) => {
      setEventList((eventList) => {
        const newEventList = [...eventList];
        newEventList[doc.data().day].push(doc.data());
        return newEventList;
      })
    })
  }

  useEffect(() => {
    getEvent(currentYear, currentMonth);
  }, [])

  const onDayPress = (e) => {
    setSelectedDay(e.day);
  }

  const onMonthChange = (e) => {
    const year = e.year;
    const month = e.month;
    getEvent(year, month);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/*<Calendar 
        enableSwipeMonths={true}
        onDayPress={(e) => onDayPress(e)}
        markingType={'multi-dot'}
        markedDates={{
        }}
      />*/}
      <Calendar
        enableSwipeMonths={true}
        onMonthChange={(e) => onMonthChange(e)}
        dayComponent={({date, state}) => {
          return (
            <View>
              <TouchableOpacity activeOpacity={0.5} onPress={() => onDayPress(date)}>
                <Text style={{
                  textAlign: 'center', 
                  color: state === 'disabled' ? 
                    '#d9e1e8' : (date.day === currentDay && date.month === currentMonth && date.year === currentYear ? 
                      '#00BBF2' : '#2d4150'),
                  fontSize: '16',
                  fontFamily: 'System',
                  fontWeight: '300',
                  marginTop: '5%'
                  }}
                >{date.day}</Text>
              </TouchableOpacity>
              <Text style={{
                fontSize: '10',
                textAlign: 'center'
              }}>
                {eventList[date.day].length > 0 && state !== 'disabled' ? 
                  eventList[date.day].length.toString() : ''}
              </Text>
            </View>
          );
        }}
      />
      {selectedDay > 0 &&
        <>
          <View style={styles.eventOuterContainer}>
            {eventList[selectedDay].map((value, index) => {
              return (              
                <View style={styles.eventInnerContainer} key={index}>
                  <Text style={{
                    fontFamily: 'Philosopher-Regular',
                    fontSize: 20,
                  }}>Tiêu đề: {value.title}</Text>                  
                  <Text style={{
                    fontFamily: 'Philosopher-Regular',
                    fontSize: 20,
                  }}>Nhóm: {value.group}</Text>
                  <Text style={{
                    fontFamily: 'Philosopher-Regular',
                    fontSize: 20,
                  }}>Hạn cuối: {value.day}-{value.month}-{value.year}</Text>
                  {value.URL !== null && 
                    <TouchableOpacity activeOpacity={0.5} onPress={() => Linking.openURL(value.URL)}>
                      <Text style={{
                        fontFamily: 'Philosopher-Regular',
                        fontSize: 20,
                        color: '#4B56D2'
                      }}>{value.fileName}</Text>
                    </TouchableOpacity>
                  }
                  <Text style={{
                    fontFamily: 'Philosopher-Regular',
                    fontSize: 20,
                  }}>Nội dung: {value.description}</Text>
                </View>
              )
            })}
          </View>
        </> 
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },  
  contentContainer: {

  },
  eventOuterContainer: {
    width: '100%',
    alignItems: 'center',
  },
  eventInnerContainer: {
    //height: '100%',
    width: '95%',
    backgroundColor: '#F7F5EB',
    borderRadius: '5px',
    justifyContent: 'flex-start',
    //alignItems: 'center',
    flexDirection: 'column',
    paddingLeft: '4%',
    paddingTop: '2.5%',
    paddingBottom: '2.5%',
    paddingRight: '4%',
    marginTop: 7.5
  },
})