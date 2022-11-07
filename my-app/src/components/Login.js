import React, { Component } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { auth } from '../firebase/config'

class Login extends Component {

    constructor() {
        super()
        this.state = {
            email: '',
            password: '',

        }
    }

    onSubmit2() {
        auth.signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(response => {
                this.props.navigation.navigate('AppMainPage')
            })
            .catch(error => {
                console.log(error);
                console.log(this.state.loggedIn);
            })

    }

    render() {
        return (
            <React.Fragment>
                <View style={styles.mainContainer}>
                    <View style={styles.contendorLogin}>
                        {
                            this.state.loggedIn
                                ? <Text>Hola, {auth.currentUser?.email}</Text>
                                : ''
                        }
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
                        <TouchableOpacity onPress={() => this.onSubmit2()}>
                            <Text style={styles.fuenteLogin}>Login</Text>
                        </TouchableOpacity>
                        <Text>{this.state.loggedIn}</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Text>Volver</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate("AppMainPage")}>
                            <Text>Ir a Pagina</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </React.Fragment>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        alignItems: 'center'
    },
    contendorLogin: {
        flexDirection: 'column',
        margin: 10,
        padding: 30,
        width: '40%',
        textAlign: 'center',
        backgroundColor: 'blue',
        borderRadius: 4,
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

export default Login