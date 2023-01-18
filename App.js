import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './components/login';
import AddInfo from './components/addInfo';
import TeacherMain from './components/teacherMain';
import StudentMain from './components/studentMain';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="AddInfo" component={AddInfo}/>
        <Stack.Screen name="TeacherCalendar" component={TeacherMain}/>
        <Stack.Screen name="StudentCalendar" component={StudentMain}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
