import { useState } from "react"
import { View, Button, Text } from "react-native"
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
    <View>
      {open.calendar && 
        <View>
          <TeacherCalendar open={open} setOpen={setOpen} />
          <Button title={"Add event"} onPress={() => setOpen({...open, calendar: false, addEvent: true})}/>
          <Button title={"Add group"} onPress={() => setOpen({...open, calendar: false, addGroup: true})}/>
          <Button title={"Display group"} onPress={() => setOpen({...open, calendar: false, displayGroup: true})}/>
        </View>
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