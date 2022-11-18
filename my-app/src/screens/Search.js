import React, {Component} from "react";
import {Text, View, StyleSheet, TouchableOpacity, TextInput, FlatList} from 'react-native';
import {db} from '../firebase/config';

class Search extends Component {

    constructor(props) {
        super(props)
        this.state = {
            search: false,
            value: '',
            users: [],
            filteredUsers: [],
            error: ''

        }
    }

    componentDidMount() {
        db.collection('datosUsuario').onSnapshot(
            docs => {
                let info = [];

                docs.forEach( doc => {
                    info.push({id: doc.id, data: doc.data()})
                })
                this.setState({users: info, search: true})


            }
        )
    }
    preventSubmit(e){       
        e.preventDefault() 

        this.setState({ error: ''}); 

        let textToFilter = this.state.value.toLowerCase();

        if (this.state.value === '') {
            this.setState({requiredField: 'You cannot send an empty form'})
        } else {
            console.log(this.state.users)
            this.setState({requiredField: ''})

            let filteredUsers = this.state.users.filter(user => user.data.username?.toLowerCase().includes(textToFilter));
            
            console.log(filteredUsers)

            if (filteredUsers.length === 0) return this.setState({ error: 'Sorry, that user does not exist', filteredUsers: []}) 


            this.setState({ filteredUsers: filteredUsers}) 
        }
    }

    controlChanges(e){

                
        if (e.target.value === '') {
            this.setState({
                filteredUsers: []
            })
        } else {
    
            let filteredUsers = this.state.users.filter(user => user.data.username?.toLowerCase().includes(e.target.value));
        this.setState({ filteredUsers: filteredUsers}) 
        }   



    }

    clear(){
        this.setState({
            search: false,
            value: '',
            result: [],
        })
    }


    render() {
        return (
            <View>
                
                <TextInput placeholder="Introduce un Usuario" 
                onChangeText={ text => (this.setState({value: text}))}
                value={this.state.value}
                onChange={(e) => this.controlChanges(e)}
                />

                <TouchableOpacity onPress={(e) => this.preventSubmit(e)}>
                    <Text>Buscar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.clear()}>
                    <Text>Borrar busqueda</Text>
                </TouchableOpacity>

                <Text>{this.state.requiredField}</Text>

                <Text>{this.state.error}</Text>

                <FlatList data={this.state.filteredUsers}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => <Text>{item.data.username}</Text>}
                />




            </View>
        )
    }
}


export default Search