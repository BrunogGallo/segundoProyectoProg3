import React, { Component } from 'react'
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { db, auth } from '../firebase/config'

class Register extends Component {

    constructor() {
        super()
        this.state = {
            username: '',
            email: '',
            password: '',
            age: '',
            nationality: '',
            registered: false,
            loader: true

        }
    }

    componentDidMount() {
        this.setState({
            loader: false
        })
    }

    onSubmit() {
        auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(response => {
                this.setState({ registered: true })
                db.collection('datosUsuario').add({
                    owner: this.state.email,
                    createdAt: Date.now(),
                    age: this.state.age,
                    username: this.state.username,
                    nationality: this.state.nationality
                })
            })
            .then(() => this.props.navigation.navigate("Login"))
            .catch(error => {
                console.log(error);
            })
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
                                    placeholder='Password'
                                    secureTextEntry={true}
                                    onChangeText={text => this.setState({ password: text })}
                                    value={this.state.password}
                                />
                                <TextInput style={styles.fuenteLogin}
                                    keyboardType='default'
                                    placeholder='Nacionalidad'
                                    onChangeText={text => this.setState({ nationality: text })}
                                    value={this.state.nationality}
                                />
                                <TextInput style={styles.fuenteLogin}
                                    keyboardType='numeric'
                                    placeholder='Edad'
                                    onChangeText={text => this.setState({ age: text })}
                                    value={this.state.age}
                                />
                                <TouchableOpacity onPress={() => this.onSubmit()}>
                                    <Text style={styles.fuenteLogin}>Sign In</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
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
        fontWeight: '600',
        fontSize: '30px',
        color: 'forestgreen'
    },
    contendorLogin: {
        flexDirection: 'column',
        marginBottom: 10,
        padding: 10,
        width: '40%',
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
    }
})

export default Register