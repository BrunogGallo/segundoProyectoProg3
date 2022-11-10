import React, { Component } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native'
import { StyleSheet } from "react-native";
import { auth, db } from "../firebase/config";


class Profile extends Component {

    constructor() {
        super()
        this.state = {
            datosUsuario: null, //tiene que arrancar como null
            postsUsuario: [],
            loaderPost: true,
            loaderData: true
        }
    }

    componentDidMount() {
        db.collection('datosUsuario').where('owner', '==', auth.currentUser.email).onSnapshot(
            docs => {
                docs.forEach(doc => { //doc es un array
                    const data = doc.data();
                    this.setState({
                        datosUsuario: data,
                        loaderData: false
                    })

                })
            }
        )
        db.collection('posts').where('owner', '==', auth.currentUser.email).onSnapshot(
            docs => {

                let posts = [];
                docs.forEach(doc => {
                    const idPost = doc.id;
                    const data = doc.data();
                    const postDataConId = {
                        ...data,
                        id: idPost
                    }
                    posts.push(postDataConId)
                })
                this.setState({
                    postsUsuario: posts,
                    loaderPost: false
                })
            }

        )
    }

    render() {
        return (
                <View style={styles.contenedor}>
                    {
                        this.state.loaderData
                        ? 
                        <ActivityIndicator size='large' color='black'/>
                        :
                        <View style={styles.contenedorMain}>
                        <Text>{auth.currentUser?.email}</Text>
                        <Text>Age: {this.state.datosUsuario?.edad}</Text>
                        <Text>Dni: {this.state.datosUsuario?.dni}</Text>
                        <MyCamera />
                        </View>
                    }
                    

                    {
                        this.state.loader
                        ? 
                        <ActivityIndicator size='large' color='black'/>
                        : 
                        <FlatList
                        data={this.state.postsUsuario}
                        keyExtractor={post => post.id.toString()}
                        renderItem={({ item }) => <Posts postData={item} />}
                        />
                    }
                </View>
        )
    }

}
const styles = StyleSheet.create({
    contenedor: {
        textAlign: 'center',
        padding: 10
    },
    contenedorMain: {
        alignItems:'center',
        justifyContent: 'center'
    }
})
export default Profile