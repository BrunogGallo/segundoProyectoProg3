import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import Register from './src/components/Register';
import Login from './src/components/Login';
import AppMainPage from './src/components/AppMainPage';
import CommentsScreen from './src/screens/CommentsScreen';


const Stack = createNativeStackNavigator()
class App extends Component {

  constructor() {
    super()
    this.state = {

    }
  }

  render() {
    return (
      <NavigationContainer >
        <Stack.Navigator>
          <Stack.Screen name='Login' component={Login} options={{ headerShown: false }}/>
          <Stack.Screen name='Register' component={Register} options={{ headerShown: true }}/>
          <Stack.Screen name='AppMainPage' component={AppMainPage} options={{ headerShown: false }}/>
          <Stack.Screen name='CommentsScreen' component={CommentsScreen} options={{ headerShown: true }}/>
        </Stack.Navigator>
      </NavigationContainer>

    )
  }

}

export default App
