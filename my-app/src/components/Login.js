import React, { Component } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import { auth } from '../firebase/config'

class Login extends Component {

    constructor() {
        super()
        this.state = {
            email: '',
            password: '',
            loader: true
        }
    }

    componentDidMount() {
        auth.currentUser ==! null
            ? this.props.navigation.navigate('AppMainPage')
            : this.setState({
                loader: false
            })
            
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

                {
                this.state.loader
                ? <ActivityIndicator size='large' color='black' />
                :
                <View style={styles.mainContainer}>
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
                            placeholder='Password'
                            secureTextEntry={true}
                            onChangeText={text => this.setState({ password: text })}
                            value={this.state.password}
                        />
                        <TouchableOpacity onPress={() => this.onSubmit2()}>
                            <Text style={styles.fuenteLogin}>Login</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                            <Text>No tienes cuenta? Registrate</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate("AppMainPage")}>
                            <Text>Ir a Pagina</Text>
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
        fontWeight: '600',
        fontSize: '30px',
        color: 'forestgreen'
    },
    contendorLogin: {
        flexDirection: 'column',
        marginBottom: 20,
        padding: 20,
        width: '40%',
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
        margin: 15,
        padding: 10,
        borderRadius: 4
    }
})

export default Login