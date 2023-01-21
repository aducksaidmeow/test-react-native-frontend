import { useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { Calendar } from "react-native-calendars"
import { db } from "../../firebaseConfig"
import { getDocs, collection, query, where } from "firebase/firestore"
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TeacherCalendar({ open, setOpen }) {

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
    if (currentMonth === e.month) setSelectedDay(e.day);
  }

  const onMonthChange = (e) => {
    const year = e.year;
    const month = e.month;
    getEvent(year, month);
  }

  return (
    <View>
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
          {eventList[selectedDay].map((value, index) => {
            return (
              <View style={styles.eventOuterContainer} key={index}>
                <View style={styles.eventInnerContainer} key={index}>
                  <View style={styles.firstRow}>
                    <View style={styles.title}>
                      <Text>{value.title}</Text>
                    </View>
                    <View style={styles.group}>
                      <Text>{value.group}</Text>
                    </View>
                    <View style={styles.date}>
                      <Text>{value.day}-{value.month}-{value.year}</Text>
                    </View>
                  </View>
                  <View style={styles.description}>
                    <Text>{value.description}</Text>  
                  </View>                  
                </View>
              </View>
              
            )
          })}
        </> 
      }
    </View>
  )
}

const styles = StyleSheet.create({
  eventOuterContainer: {
    height: '30%',
    width: '100%',
    alignItems: 'center'
  },
  eventInnerContainer: {
    height: '100%',
    width: '95%',
    backgroundColor: '#E3ACF9',
    borderRadius: '5px',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  firstRow: {
    height: '20%',
    width: '100%',
    flexDirection: 'row',
    //backgroundColor: '#FADA9D',
    marginTop: '5%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    height: '100%',
    width: '30%',
    backgroundColor: '#D3756B',
    marginRight: '2.5%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '5px'
  },
  group: {
    height: '100%',
    width: '30%',
    backgroundColor: '#D3756B',
    marginRight: '2.5%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '5px'
  },
  date: {
    height: '100%',
    width: '30%',
    backgroundColor: '#D3756B',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '5px'
  },
  description: {
    height: '50%',
    width: '90%',
    flexDirection: 'row',
    marginTop: '4%',
    backgroundColor: '#FADA9D',
    padding: '2%',
    borderRadius: '5px'
  }
})