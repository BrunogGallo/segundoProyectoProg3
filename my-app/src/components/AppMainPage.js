import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import AddPost from "../screens/AddPost";
import Search from "../screens/Search";
import {FontAwesome} from '@expo/vector-icons'


const Tab = createBottomTabNavigator()
function AppMainPage() {

    return (
        <React.Fragment>
            <Tab.Navigator>
                <Tab.Screen name='Home' component={Home}
                    options={
                        { tabBarIcon: () => <FontAwesome name='home' size={24} color='black' /> }
                    } />

                <Tab.Screen name='Profile' component={Profile}
                    options={
                        { tabBarIcon: () => <FontAwesome name='user' size={24} color='black' /> }
                    } />

                <Tab.Screen name='AddPost' component={AddPost}
                    options={
                        { tabBarIcon: () => <FontAwesome name='plus-square' size={24} color='black' /> }
                    } />
                <Tab.Screen name='Search' component={Search}
                    options={
                        { tabBarIcon: () => <FontAwesome name='plus-square' size={24} color='black' /> }
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