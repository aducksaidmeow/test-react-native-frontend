import { useState } from "react"
import { View, Button, StyleSheet } from "react-native"
import StudentCalendar from "./function/studentCalendar"

export default function StudentMain() {

  return (
    <View style={styles.container}>
      <StudentCalendar />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    position: 'relative',
    backgroundColor: '#DDDDDD',
  },
})