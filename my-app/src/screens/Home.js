import React, { Component } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { StyleSheet } from "react-native";
import { auth, db } from "../firebase/config";

class Home extends Component {

    constructor() {
        super()
        this.state = {
            posts: [],
            loader: true
        }
    }

    componentDidMount() {
        db.collection('posts').orderBy('createdAt', 'asc').limit(3).onSnapshot(
            docs => {

                let posts = [];

                docs.forEach(doc => {
                    const idPost = doc.id;
                    const data = doc.data();
                    const postDataConId = {
                        ...data,
                        id: idPost
                    }

                    posts.push(postDataConId)

                });

                this.setState({
                    // posts: [...this.state.posts, postDataConId]
                    posts: posts,
                    loader: false
                })
            }
        )
    }

    desloguear() {
        auth.signOut();
        this.props.navigation.navigate("Login")
    }

    render() {

        return (
            <React.Fragment>

                <View style={styles.contenedor}>
                    <Text>Hola {auth.currentUser.email}</Text>
                    <TouchableOpacity onPress={() => this.desloguear()}>
                        <Text>Sign Out</Text>
                    </TouchableOpacity>

                    <Image style={styles.image}
                            source={require('../../assets/Foodle.png')}
                            resizeMode='contain'/>

                    {
                        this.state.loader
                            ? 
                            <ActivityIndicator size='large' color='black'/>
                            : 
                            <></>
                            // <FlatList 
                            //     data={this.state.posts}
                            //     keyExtractor={post => post.id.toString()}
                            //     renderItem={({ item }) => <Posts postData={item} />}
                            // />
                            
                    }

                </View>
            </React.Fragment>
        )
    }
}
const styles = StyleSheet.create({
    contenedor: {
        textAlign: 'center',
        padding: 10
    },
    image: {
        height: 400
    }
})
export default Home