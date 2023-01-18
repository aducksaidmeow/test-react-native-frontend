import { View, Text, Button } from "react-native";
import { Calendar } from "react-native-calendars"

export default function StudentCalendar({ open, setOpen }) {

  const onDayPress = (e) => {
    console.log(e);
  }

  return (
    <View>
      <Calendar 
        enableSwipeMonths={true}
        onDayPress={(e) => onDayPress(e)}
      />
    </View>
  )
}