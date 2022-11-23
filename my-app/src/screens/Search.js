import React, {Component} from "react";
import {Text, View, StyleSheet, TouchableOpacity, TextInput, FlatList, Image} from 'react-native';
import {db} from '../firebase/config';
import {  MaterialIcons  } from '@expo/vector-icons';
import { Searchbar } from 'react-native-paper';
import IconoUsuario from "../components/IconoUsuario";


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
        e.preventDefault() 

        this.setState({ error: ''}); 
                
        if (e.target.value === '') {
            this.setState({
                filteredUsers: []
                
            })
        } else {
            
    
            let filteredUsers = this.state.users.filter(user => user.data.username?.toLowerCase().includes((e.target.value).toLowerCase()));

            if (filteredUsers.length === 0) return this.setState({ error: 'Sorry, that user does not exist', filteredUsers: []}) 

            this.setState({ filteredUsers: filteredUsers}) 
        }   



    }

    clear(){
        this.setState({
            search: false,
            value: '',
            result: [],
            filteredUsers: []

        })
    }


    render() {
        return (
            <View style={styles.searchBar}>
                
                <Searchbar style={styles.inputSearch} placeholder="Introduce un Usuario" 
                onChangeText={ text => (this.setState({value: text}))}
                value={this.state.value}
                onChange={(e) => this.controlChanges(e)}
                
                />

                

                <Text style={styles.err}>{this.state.requiredField}</Text>

                <Text>{this.state.error}</Text>

                <FlatList 
                data={this.state.filteredUsers}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => 
                    <View >
                        

                        <TouchableOpacity style={styles.itemContainer} onPress={() => this.props.navigation.navigate('Profile', { owner: item.data.owner })}>
                           

                                <View >
                                    <IconoUsuario nombreUsuario={item.data.username} />
                                </View>
                                <View >
                                    <Text style={styles.textName}> {item.data.username}</Text>
                                </View>

                            
                        </TouchableOpacity>
                    </View>
                    }
                />




            </View>
        )
    }
}
const styles = StyleSheet.create({
    searchBar: {
        textAlign: 'center',
        flex: 1
    
    },
    inputSearch: {
        marginTop: 7,
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        color: '#535353',
        width: '90%',
        borderRadius: 5,
        height: '8%',
        paddingLeft: 10,
        shadowOpacity: 20,
        alignSelf: 'center',
        marginBottom: 20,
    },
    
   
    err: {
        fontSize: 15,
        fontWeight: 'bold'
    },
   
    itemContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'gray',
        borderWidth: 0.6
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    textName: {
        fontSize: 17,
        marginLeft: 10,
        fontWeight: '600',
    }

  });

export default Search