import React, { Component } from "react";
import { Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { StyleSheet } from "react-native";
import { auth, db } from "../firebase/config";
import firebase from "firebase";
import MyCamera from "../components/MyCamera";

class AddPost extends Component {

    constructor(props) {
        super(props)
        this.state = {
            datosUsuario: null, //tiene que arrancar como null
            title: '',
            postContent: '',
            camera: false,
            photoTaken: false,
            url: ''
        }
    }

    componentDidMount() {
        db.collection('datosUsuario').onSnapshot(
            docs => {
                docs.forEach(doc => { //doc es un array
                    const data = doc.data();
                    if (data.owner === auth.currentUser.email) {
                        this.setState({
                            datosUsuario: data
                        })
                    }
                })
            }
        )
    }

    onSubmit() {
        db.collection('posts').add({
            owner: auth.currentUser.email,
            ownerUsername: this.state.datosUsuario.username,
            title: this.state.title,
            postContent: this.state.postContent,
            createdAt: Date.now(),
            likes: [],
            photo: this.state.url
        })
            .then(() => {
                this.setState({
                    title: '',
                    postContent: '',
                    camera: false,
                    photoTaken: false,
                    url: ''
                },
                    this.props.navigation.navigate('Home')
                )

            })
            .catch(error => console.log(error))
    }
    onImageUpload(url) {
        this.setState({
            showCamera: false,
            photoTaken: true,
            url: url
        });
    }
    render() {
        return (
            <React.Fragment>
                <View style={styles.container}>

                    <View style={styles.formContainer}>
                        <TextInput style={styles.formInput}
                            keyboardType='default'
                            placeholder='Title'
                            onChangeText={text => this.setState({ title: text })}
                            value={this.state.title}
                        />
                        <TextInput style={styles.formInput}
                            keyboardType='default'
                            placeholder='Add a description'
                            onChangeText={text => this.setState({ postContent: text })}
                            value={this.state.postContent}
                        />
                    </View>
                    {
                        this.state.photoTaken
                            ?
                            <View style={styles.preview}>

                                <Image source={{ uri: this.state.url }} style={styles.previewImage} />
                                <TouchableOpacity onPress={() => this.onSubmit()}>
                                    <Text style={styles.button}>Post</Text>
                                </TouchableOpacity>

                            </View>
                            :
                            <React.Fragment>
                                {
                                    this.state.camera === false
                                        ?
                                        <TouchableOpacity  onPress={() => this.setState({ camera: true })}>
                                            <Text style={styles.button}>Take a pic</Text>
                                        </TouchableOpacity>
                                        :
                                        <MyCamera
                                            onImageUpload={(url) => this.onImageUpload(url)}
                                        />
                                }
                            </React.Fragment>

                    }
                </View>
            </React.Fragment>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        textAlign: 'center',
        padding: 10,
        justifyContent: 'center'
    },
    formContainer: {
        backgroundColor: 'darkseagreen',
        borderRadius: 20
    },
    formInput: {
        marginVertical: 10,
        backgroundColor: 'white',
        margin: 10,
        padding: 10,
        borderRadius: 4
        // height: 100,
        // paddingVertical: 15,
        // paddingHorizontal: 10,
        // borderWidth: 1,
        // borderStyle: 'solid',
        // borderRadius: 6,
        // marginVertical: 10,
    },
    preview: {
        alignItems: 'center',
        backgroundColor: 'grey',
    },
    previewImage: {
        height: 300,
        width: 300
    },
    formButton: {
        width: 'fit-content',
        alignSelf: "center",
        color: 'white',
        padding: 6,
        margin: 4,
        marginBottom: 10,
        marginTop: 10,
        borderRadius: 4,
        backgroundColor: 'white'
    },
    button: {
        color: 'white',
        textAlign: 'center',
        margin: 3,
        backgroundColor: 'forestgreen',
        margin: 10,
        padding: 15,
        borderRadius: 20,
        fontWeight: 'bold',
    },
})
export default AddPost