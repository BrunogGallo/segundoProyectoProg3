import React, { Component } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native'
import { StyleSheet } from "react-native";
import Posts from "../components/Posts";
import { auth, db } from "../firebase/config";
import IconoUsuario from "../components/IconoUsuario";

class Profile extends Component {

    constructor() {
        super()
        this.state = {
            datosUsuario: null, //tiene que arrancar como null
            postsUsuario: [],
            loaderPost: true,
            loaderData: true,
        }
    }

    componentDidMount() {
        auth.currentUser.email === this.props.route.params.owner
        ? this.props.navigation.navigate('Mi Perfil')
        :
        db.collection('datosUsuario').where('owner', '==', this.props.route.params.owner).onSnapshot(
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
        db.collection('posts').where('owner', '==', this.props.route.params.owner).onSnapshot(
            docs => {

                let posts = [];

                docs.forEach(doc => {
                  const data = doc.data();
                  const id = doc.id;
                  posts.push({ data, id }); //? por qué usamos los corchetes acá?
                  //! la información se guarda dentro del data, por eso despues hacemos postData.data. En el console.log se ve claramente esto. 
                });
        
                this.setState({
                  // posts: [...this.state.posts, postDataConId]
                  postsUsuario: posts,
                  loaderPost: false,
                })
            }

        )
    }

    desloguear() {
        auth.signOut();
        this.props.navigation.navigate('Login')
    }

    render() {
        console.log(this.state.datosUsuario)
        console.log(this.props.route.params)
        return (
            
            <ScrollView style={{backgroundColor: 'grey'}}>
                
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
                                        <IconoUsuario nombreUsuario={this.state.datosUsuario?.username} />

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

                {
                    this.state.loaderPost
                        ?
                        <ActivityIndicator size='large' color='black' />
                        :
                        <FlatList
                            data={this.state.postsUsuario}
                            keyExtractor={post => post.id.toString()}
                            renderItem={({ item }) => <Posts navigation={this.props.navigation} datosUsuario={this.state.datosUsuario} postData={item} />}
                        />
                }
            </ScrollView>
        )
    }

}
const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'green'
    },
    image: {
        height: 50,
        width: 50
    },
    userDataContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingTop: 30,
        padding: 10,
        backgroundColor: 'white',
        position: 'relative',
        borderRadius: 15
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
export default Profile