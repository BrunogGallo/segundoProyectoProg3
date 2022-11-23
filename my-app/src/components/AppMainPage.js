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
import Profile from "../screens/Profile";
import { useLinkProps } from "@react-navigation/native";
import { auth } from "../firebase/config";

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
            <Stack.Screen name='Profile' component={Profile} options={{title: ''}} />
        </Stack.Navigator>
    )
}

function SearchStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Search" component={Search} options={{ headerShown: false }}/>
            <Stack.Screen name='Profile' component={Profile} options={{ title: ''}}/>
        </Stack.Navigator>
    )
}
function AppMainPage() {

    return (
        <React.Fragment>
            <Tab.Navigator screenOptions={
                { 
                    tabBarShowLabel: false, 
                    tabBarActiveTintColor: 'green',
                    // tabBarStyle: {borderRadius: 8}, 
                    headerShown: false
                
                }}>
                <Tab.Screen name='Home2' component={HomeStack}
                    options={
                        {
                            tabBarIcon: ({ color }) => (<FontAwesome name='home' size={24} color={color} />),
                            headerShown: false
                            
                        }
                    } />

                <Tab.Screen name="Search2" component={SearchStack}
                    options={
                        {
                            headerLarge: true,
                            headerTitle: 'Search',
                            headerShown: false,
                            headerSearchBarOptions: {
                                placeholder: 'Usuarios',
                            },
                            tabBarIcon: ({ color }) => (<AntDesign name="search1" size={24} color={color} />)
                        }
                    } />
                <Tab.Screen name='Mi Perfil' component={MyProfile}
                    options={
                        { 
                        tabBarIcon: ({ color }) => (<FontAwesome name='user' size={24} color={color} />),
                        // headerTitle: ({props}) => (props.datosUsuario.username)
                    }
                    } />

                <Tab.Screen name='Agregar' component={AddPost}
                    options={
                        { tabBarIcon: ({ color }) => (<FontAwesome name='plus-square' size={24} color={color} />) }
                    } />
            </Tab.Navigator>
        </React.Fragment>
    )
}
export default AppMainPage