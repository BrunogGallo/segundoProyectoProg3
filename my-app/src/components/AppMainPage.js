import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from "../screens/Home";
import AddPost from "../screens/AddPost";
import Search from "../screens/Search";
import { FontAwesome } from '@expo/vector-icons'
import MyProfile from "../screens/MyProfile";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AntDesign } from '@expo/vector-icons'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()
function AppMainPage() {

    return (
            <Tab.Navigator screenOptions={{tabBarShowLabel: false, tabBarActiveTintColor: 'green', headerShown: 'false'}}>
                <Tab.Screen name='Home' component={Home}
                    options={
                        { tabBarIcon: ({color}) => (<FontAwesome name='home' size={24} color={color} />) }
                    } />

                <Tab.Screen name="Search"
                    
                    component={Search} 
                    options={
                        { 
                            headerLarge: true,
                            headerTitle: 'Search',
                            headerShown:'false',
                            headerSearchBarOptions: {
                                placeholder: 'Usuarios',
                            },
                            tabBarIcon: ({color}) => (<AntDesign name="search1" size={24} color={color} />) }
                    } />
                <Tab.Screen name='Mi Perfil' component={MyProfile}
                    options={
                        { tabBarIcon: ({color}) => (<FontAwesome name='user' size={24} color={color} />) }
                    } />

                <Tab.Screen name='Agregar' component={AddPost}
                    options={
                        { tabBarIcon: ({color}) => (<FontAwesome name='plus-square' size={24} color={color} />) }
                    } />
            </Tab.Navigator>
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