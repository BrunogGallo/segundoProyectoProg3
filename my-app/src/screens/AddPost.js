import React, { Component } from "react";
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { StyleSheet } from "react-native";
import { auth, db } from "../firebase/config";
import firebase from "firebase";

class AddPost extends Component {

    constructor() {
        super()
        this.state = {
            datosUsuario: null, //tiene que arrancar como null
            title: '',
            postContent: ''
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
            title: this.state.title,
            postContent: this.state.postContent,
            createdAt: Date.now(),
            likes: []
        })
        .then (()=> this.props.navigation.navigate ('Home'))
        .catch ((error) => console.log(error))
    }

    render() {
        return (
            <React.Fragment>
                <View style={styles.container}>
                    <Text>Hi, {auth.currentUser?.email}</Text>
                    <Text>Add a new post</Text>
                    <View style={styles.formContainer}>
                        <TextInput style={styles.formInput}
                            keyboardType='default'
                            placeholder='Title'
                            onChangeText={text => this.setState({ title: text })}
                            value={this.state.title}
                        />
                        <TextInput style={styles.formInput}
                            keyboardType='default'
                            placeholder='Content'
                            onChangeText={text => this.setState({ postContent: text })}
                            value={this.state.postContent}
                        />

                        <TouchableOpacity style={styles.fromButton} onPress={()=> this.onSubmit()}>
                            <Text >Post</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </React.Fragment>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        textAlign: 'center',
        padding: 10
    },
    formContainer: {
        backgroundColor: 'black',
        borderRadius: 4
    },
    formInput: {
        color: 'white',
        textAlign: 'center',
        margin: 3,
        backgroundColor: 'grey',
        margin: 10,
        padding: 10,
        borderRadius: 4
    },
    fromButton: {
      width: 'fit-content',
      alignSelf: "center",
      color: 'black',
      padding: 6,
      margin: 4,
      marginBottom: 10,
      borderRadius: 4,
      backgroundColor: 'white'
    }
})
export default AddPost