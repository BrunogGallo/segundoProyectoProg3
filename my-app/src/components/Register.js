import React, {Component} from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import {db, auth} from '../firebase/config'

class Register extends Component {

    constructor () {
        super ()
        this.state ={
            email: '',
            password: '',
            dni: '',
            edad: '',
            registered: false,
            loggedIn: false,
            
        }
    }

    onSubmit () {
        auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then (response => {
            this.setState({registered: true})
            db.collection('datosUsuario').add({
                owner: this.state.email,
                createdAt: Date.now(),
                dni: this.state.dni,
                edad: this.state.edad
            })
        })
        .then ( ()=> this.props.navigation.navigate("Login"))
        .catch(error => {
            console.log(error);
            console.log(this.state.registered);
        })
    }


    render () {
        return (
            <React.Fragment>
                <View style={styles.contendorLogin}>
                    <TextInput style={styles.fuenteLogin} 
                    keyboardType='email-adress'
                    placeholder='Email'
                    onChangeText={text => this.setState({email: text})}
                    value={this.state.email}
                    />
                    <TextInput style={styles.fuenteLogin}
                    keyboardType='default'
                    placeholder='Password'
                    secureTextEntry={true}
                    onChangeText={text => this.setState({password: text})}
                    value={this.state.password}
                    />
                    <TextInput style={styles.fuenteLogin}
                    keyboardType='numeric'
                    placeholder='Dni'
                    onChangeText={text => this.setState({dni: text})}
                    value={this.state.dni}
                    />
                    <TextInput style={styles.fuenteLogin}
                    keyboardType='numeric'
                    placeholder='Edad'
                    onChangeText={text => this.setState({edad: text})}
                    value={this.state.edad}
                    />
                    <TouchableOpacity onPress={() => this.onSubmit()}>
                        <Text style={styles.fuenteLogin}>Sign In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={ ()=> this.props.navigation.navigate('Login')}>
                        <Text>Ya tienes cuenta? Ingresa</Text>
                    </TouchableOpacity>
                </View> 
            </React.Fragment>
        )
    }
}

const styles = StyleSheet.create ({
    contendorLogin: {
        flexDirection: 'column',
        margin: 10,
        padding: 10,
        width: '100%',
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

export default Register