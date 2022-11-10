import React, { Component } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View, Image } from 'react-native'
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
            <React.Fragment>
                {
                    this.state.loaderData
                        ?
                        <ActivityIndicator size='large' color='black' />
                        :
                        <View style={styles.userDataContainer}>
                            <Image style={styles.image}
                                source={require('../../assets/default-user-image.png')}
                                resizeMode='contain'
                            />
                            <View>
                            <Text>{this.state.datosUsuario?.username}</Text>
                            <Text>{auth.currentUser?.email}</Text>
                            <Text>{this.state.datosUsuario?.nationality}</Text>
                            </View>
                        </View>
                }


                {
                    this.state.loader
                        ?
                        <ActivityIndicator size='large' color='black' />
                        :
                        <FlatList
                            data={this.state.postsUsuario}
                            keyExtractor={post => post.id.toString()}
                            renderItem={({ item }) => <Posts postData={item} />}
                        />
                }
            </React.Fragment>
        )
    }

}
const styles = StyleSheet.create({
    mainContainer: {
        textAlign: 'center',
        padding: 10
    },
    image: {
        height: 50,
        width: 50
    },
    userDataContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 20,
        padding: 10,
        backgroundColor: 'white'

    }
})
export default Profile