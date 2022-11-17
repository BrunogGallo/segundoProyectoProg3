import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import AddPost from "../screens/AddPost";
import Search from "../screens/Search";
import {FontAwesome} from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';


const Tab = createBottomTabNavigator()
function AppMainPage() {

    return (
        <React.Fragment>
            <Tab.Navigator screenOptions={{tabBarShowLabel: false, tabBarActiveTintColor: 'green'}}>
                <Tab.Screen name='Home' component={Home}
                    options={
                        { tabBarIcon: ({color}) => (<FontAwesome name='home' size={24} color={color} />) }
                    } />

                <Tab.Screen name='Search' component={Search}
                    options={
                        { tabBarIcon: ({color}) => (<AntDesign name="search1" size={24} color={color} />) }
                    } />
                <Tab.Screen name='Profile' component={Profile}
                    options={
                        { tabBarIcon: ({color}) => (<FontAwesome name='user' size={24} color={color} />) }
                    } />

                <Tab.Screen name='AddPost' component={AddPost}
                    options={
                        { tabBarIcon: ({color}) => (<FontAwesome name='plus-square' size={24} color={color} />) }
                    } />
                
            </Tab.Navigator>
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