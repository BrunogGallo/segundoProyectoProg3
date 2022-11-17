import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import AddPost from "../screens/AddPost";
import Search from "../screens/Search";
import { FontAwesome } from '@expo/vector-icons'
import MyProfile from "../screens/MyProfile";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'


const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()
function AppMainPage() {

    return (
        <React.Fragment>
            <Tab.Navigator>
                <Tab.Screen name='Home' component={Home}
                    options={
                        { tabBarIcon: () => <FontAwesome name='home' size={24} color='black' /> }
                    } />

                <Tab.Screen name='Buscar' component={Search}
                    options={
                        { tabBarIcon: () => <FontAwesome name='search' size={24} color='black' /> }
                    } />
                <Tab.Screen name='Mi Perfil' component={MyProfile}
                    options={
                        { tabBarIcon: () => <FontAwesome name='user' size={24} color='black' /> }
                    } />

                <Tab.Screen name='Agregar' component={AddPost}
                    options={
                        { tabBarIcon: () => <FontAwesome name='plus-square' size={24} color='black' /> }
                    } />
            </Tab.Navigator>
                <Stack.Navigator>
                    <Stack.Screen name='Profile' component={Profile} />
                </Stack.Navigator>
        </React.Fragment>
    )
}
const styles = StyleSheet.create({
    contenedor: {
        textAlign: 'center',
        alignItems: 'flex-end',
        padding: 10000
    }
})
export default AppMainPage