import React, { Component } from 'react'
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { db, auth } from '../firebase/config'
import MyCamera from './MyCamera'

class Register extends Component {

    constructor() {
        super()
        this.state = {
            username: '',
            email: '',
            password: '',
            age: '',
            bio: '',
            loader: true,
            errors: '',
            photo: '',
            showCamera: false,
            photoTaken: false
        }
    }

    componentDidMount() {
        this.setState({
            loader: false
        })
    }

    onSubmit() {
        this.state.bio.length > 20
            ? this.setState({
                errors: 'La descripcion debe tener un maximo de 15 caracteres'
            })
            :
            auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(response => {
                    db.collection('datosUsuario').add({
                        owner: this.state.email,
                        createdAt: Date.now(),
                        age: this.state.age,
                        username: this.state.username,
                        bio: this.state.bio,
                        photo: this.state.photo
                    })
                })
                .then(() => this.props.navigation.navigate("Login"))
                .catch(error => {
                    this.setState({
                        errors: error.message
                    },
                        console.log(error)
                    )
                })
    }
    onImageUpload(url) {
        this.setState({
            showCamera: false,
            photoTaken: true,
            photo: url
        });
    }

    render() {
        return (
            <React.Fragment>
                <View style={styles.mainContainer}>
                    {
                        this.state.loader
                            ? <ActivityIndicator />
                            :
                            <View style={styles.contendorLogin}>
                                <Text style={styles.title}>Foodle</Text>
                                <Text style={styles.error}>{this.state.errors}</Text>
                                <TextInput style={styles.fuenteLogin}
                                    keyboardType='email-adress'
                                    placeholder='Email'
                                    onChangeText={text => this.setState({ email: text })}
                                    value={this.state.email}
                                />
                                <TextInput style={styles.fuenteLogin}
                                    keyboardType='default'
                                    placeholder='Nombre de usuario'
                                    onChangeText={text => this.setState({ username: text })}
                                    value={this.state.username}
                                />
                                <TextInput style={styles.fuenteLogin}
                                    keyboardType='default'
                                    placeholder='Contraseña'
                                    secureTextEntry={true}
                                    onChangeText={text => this.setState({ password: text })}
                                    value={this.state.password}
                                />
                                <TextInput style={styles.fuenteLogin}
                                    keyboardType='numeric'
                                    placeholder='Edad'
                                    onChangeText={text => this.setState({ age: text })}
                                    value={this.state.age}
                                />
                                <TextInput style={styles.fuenteLogin}
                                    keyboardType='default'
                                    placeholder='Algo sobre ti'
                                    onChangeText={text => this.setState({ bio: text })}
                                    value={this.state.bio}
                                />
                                {
                                    this.state.photoTaken
                                        ?
                                        <View style={styles.preview}>

                                            <Image source={{ uri: this.state.photo }} style={styles.previewImage} />

                                        </View>
                                        :
                                        <React.Fragment>
                                            {
                                                this.state.showCamera === false
                                                    ?
                                                    <TouchableOpacity style={{alignItems: 'center'}} onPress={() => this.setState({ showCamera: true })}>
                                                        <Text style={styles.button}>Take a pic</Text>
                                                    </TouchableOpacity>
                                                    :
                                                    <MyCamera
                                                        onImageUpload={(url) => this.onImageUpload(url)}
                                                    />
                                            }
                                        </React.Fragment>

                                }



                                {
                                    this.state.email !== '' && this.state.password !== '' && this.state.username !== ''
                                        ?
                                        <TouchableOpacity onPress={() => this.onSubmit()}>
                                            <Text style={styles.submitButton}>Registrate</Text>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity>
                                            <Text style={styles.submitButtonOff}>Registrate</Text>
                                        </TouchableOpacity>
                                }

                                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                    <Text>Ya tienes cuenta? Ingresa</Text>
                                </TouchableOpacity>
                            </View>
                    }

                </View>
            </React.Fragment>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
    },
    title: {
        fontWeight: '700',
        fontSize: '30px',
        color: 'forestgreen'
    },
    contendorLogin: {
        flexDirection: 'column',
        marginBottom: 10,
        padding: 10,
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 4,
        border: '1px solid',
        textAlign: 'center'
    },
    fuenteLogin: {
        color: 'white',
        textAlign: 'center',
        margin: 3,
        backgroundColor: 'grey',
        margin: 10,
        padding: 10,
        borderRadius: 4
    },
    submitButton: {
        color: 'white',
        textAlign: 'center',
        margin: 3,
        backgroundColor: 'forestgreen',
        margin: 18,
        padding: 10,
        borderRadius: 20,
        width: '40%',
        alignSelf: 'center'
    },
    submitButtonOff: {
        color: 'white',
        textAlign: 'center',
        margin: 3,
        backgroundColor: 'grey',
        margin: 18,
        padding: 10,
        borderRadius: 20,
        width: '40%',
        alignSelf: 'center'
    },
    error: {
        color: 'red'
    },
    preview: {
        alignItems: 'center',
        
    },
    previewImage: {
        height: 160,
        width: 160,
    },
    button: {
        color: 'white',
        textAlign: 'center',
        backgroundColor: 'grey',
        margin: 6,
        padding: 6,
        borderRadius: 20,
        width: '50%'
    }
})

export default Register