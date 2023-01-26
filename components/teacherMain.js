import { useState } from "react"
import { View, Button, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
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
              <Image source={require('./add-event.png')} style={styles.addEventImage}/>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addGroupTouchableOpacity}
              activeOpacity={0.5} 
              onPress={() => setOpen({...open, calendar: false, addGroup: true})}
            >
              <Image source={require('./add-group.png')} style={styles.addGroupImage}/>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.displayGroupTouchableOpacity}
              activeOpacity={0.5}
              onPress={() => setOpen({...open, calendar: false, displayGroup: true})}
            >
              <Image source={require('./display-group.png')} style={styles.displayGroupImage}/>
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
    backgroundColor: '#DDDDDD',
  },
  buttonContainer: {
    height: '35%',
    position: 'absolute',
    bottom: '0%',
    right: '2.5%',
    alignItems: 'center'
    //backgroundColor: '#567189',
  },
  addEventTouchableOpacity: {
    height:'25%',
    //width: '80%',
    aspectRatio: '1:1',
    backgroundColor: '#EAE0DA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10%',
    borderRadius: '15px'
  },
  addEventImage: {
    height: '75%',
    aspectRatio: '1:1',
  },
  addGroupTouchableOpacity: {
    height:'25%',
    //width: '80%',
    aspectRatio: '1:1',
    backgroundColor: '#EAE0DA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10%',
    borderRadius: '15px'
  },
  addGroupImage: {
    height: '75%',
    aspectRatio: '1:1',
  },  
  displayGroupTouchableOpacity: {
    height:'25%',
    //width: '80%',
    aspectRatio: '1:1',
    backgroundColor: '#EAE0DA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10%',
    borderRadius: '15px'
  },
  displayGroupImage: {
    height: '75%',
    aspectRatio: '1:1',
  }
})