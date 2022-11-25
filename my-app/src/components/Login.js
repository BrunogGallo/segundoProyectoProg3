import React, { Component } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import { auth } from '../firebase/config'

class Login extends Component {

    constructor() {
        super()
        this.state = {
            email: '',
            password: '',
            loader: true,
            errors: ''
        }
    }

    componentDidMount() {
        auth.onAuthStateChanged(user => { //observa los datos obtenidos del usuario
            if (user) { //usamos los datos del usuario con el parametro user
                this.props.navigation.navigate('AppMainPage')
            } else {
                this.setState({
                    loader: false
                })  
            }
        })

    }

    onSubmit() {
        auth.signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(response => {
                this.props.navigation.navigate('AppMainPage')
            })
            .catch(error => {
                this.setState({
                    errors: error.message
                })
                console.log(error)
                console.log(this.state.loggedIn)
            })
    }

    render() {
        return (
            <React.Fragment>

                {
                    this.state.loader
                        ? <ActivityIndicator size='large' color='black' />
                        :
                        <View style={styles.mainContainer}> 
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
                                    placeholder='Password'
                                    secureTextEntry={true}
                                    onChangeText={text => this.setState({ password: text })}
                                    value={this.state.password}
                                />
                                {
                                    this.state.email !== '' && this.state.password !== ''
                                        ?
                                        <TouchableOpacity onPress={() => this.onSubmit()}>
                                            <Text style={styles.submitButton}>Enter</Text>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity>
                                            <Text style={styles.submitButtonOff}>Enter</Text>
                                        </TouchableOpacity>
                                }

                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                                    <Text>Don´t have an account? Register</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                }

            </React.Fragment>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
    },
    title: {
        fontWeight: '700',
        fontSize: '30px',
        color: 'forestgreen'
    },
    contendorLogin: {
        flexDirection: 'column',
        marginBottom: 20,
        padding: 20,
        width: '80%',
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: 4,
        border: '1px solid'
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
    }
})

export default Login