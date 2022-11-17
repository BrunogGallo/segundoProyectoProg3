import React, { Component } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View, Image } from 'react-native'
import { StyleSheet } from "react-native";
import { auth, db } from "../firebase/config";


class MyProfile extends Component {

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

    desloguear() {
        auth.signOut();
        this.props.navigation.navigate("Login")
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
                            {
                                this.state.datosUsuario?.photo === '' || this.state.datosUsuario?.photo === null
                                    ?
                                    <View style={styles.profileImage}>
                                        <Image style={styles.image}
                                            source={require('../../assets/default-user-image.png')}
                                            resizeMode='contain'
                                        />
                                        <TouchableOpacity>
                                            <Text style={styles.profileData}>Cambiar foto</Text>
                                        </TouchableOpacity>
                                    </View>

                                    :
                                    <View>
                                        <Image style={styles.image}
                                            source={{ uri: this.state.datosUsuario?.photo }}
                                            resizeMode='contain'
                                        />
                                        <TouchableOpacity>
                                            <Text style={styles.profileData}>Cambiar foto</Text>
                                        </TouchableOpacity>
                                    </View>
                            }

                            <View>
                                <Text style={styles.bold}>{this.state.datosUsuario?.username}</Text>
                                <Text style={styles.profileData}>{this.state.datosUsuario?.owner}</Text>
                                <Text style={styles.profileData}>"{this.state.datosUsuario?.bio}"</Text>
                                <Text style={styles.profileData}>Publicaciones: {this.state.postsUsuario.length}</Text>
                            </View>
                        </View>
                }

                <TouchableOpacity onPress={() => this.desloguear()}>
                    <Text style={styles.signOutButton}>Sign Out</Text>
                </TouchableOpacity>

                {
                    this.state.loaderPost
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
    },
    bold: {
        fontWeight: 'bold',
        margin: 2
    },
    profileImage: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileData: {
        margin: 2
    },
    signOutButton: {
        color: 'white',
        textAlign: 'center',
        margin: 3,
        backgroundColor: 'red',
        margin: 18,
        padding: 10,
        borderRadius: 20,
        width: 'fit-content',
        alignSelf: 'flex-end'
    }
})
export default MyProfile