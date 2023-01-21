import { useState } from "react"
import { View, Button, Text, StyleSheet, TouchableOpacity } from "react-native"
import TeacherCalendar from "./function/teacherCalendar"
import AddEvent from "./function/addEvent"
import AddGroup from "./function/addGroup"
import DisplayGroup from "./function/displayGroup"

export default function TeacherMain() {

  const [open, setOpen] = useState({
    calendar: true,
    addEvent: false,
    addGroup: false,
    displayGroup: false,
  })

  return (
    <View style={styles.container}>
      {open.calendar && 
        <>
          <TeacherCalendar open={open} setOpen={setOpen} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.addEventTouchableOpacity}
              activeOpacity={0.5} 
              onPress={() => setOpen({...open, calendar: false, addEvent: true})}
            >
              <Text>Add event</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addGroupTouchableOpacity}
              activeOpacity={0.5} 
              onPress={() => setOpen({...open, calendar: false, addGroup: true})}
            >
              <Text>Add group</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.displayGroupTouchableOpacity}
              activeOpacity={0.5}
              onPress={() => setOpen({...open, calendar: false, displayGroup: true})}
            >
              <Text>Display group</Text>
            </TouchableOpacity>
          </View>
        </>
      }
      {open.addEvent && 
        <AddEvent open={open} setOpen={setOpen} />
      }
      {open.addGroup &&
        <AddGroup open={open} setOpen={setOpen} />
      }
      {open.displayGroup && 
        <DisplayGroup open={open} setOpen={setOpen} />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    position: 'relative',
    backgroundColor: '#FFF2F2',
  },
  buttonContainer: {
    height: '35%',
    position: 'absolute',
    bottom: '0%',
    right: '0%',
    alignItems: 'center'
    //backgroundColor: '#567189',
  },
  addEventTouchableOpacity: {
    height:'25%',
    width: '80%',
    backgroundColor: '#658864',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10%',
    borderRadius: '15px'
  },
  addGroupTouchableOpacity: {
    height:'25%',
    width: '80%',
    backgroundColor: '#658864',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10%',
    borderRadius: '15px'
  },
  displayGroupTouchableOpacity: {
    height:'25%',
    width: '80%',
    backgroundColor: '#658864',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10%',
    borderRadius: '15px'
  }
})