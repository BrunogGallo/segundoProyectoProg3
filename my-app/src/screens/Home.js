import React, { Component } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet } from "react-native";
import { auth, db } from "../firebase/config";
import Posts from "../components/Posts";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      posts: '', //? aca es con [] o con ''
      loader: true,
      datosUsuario: null
    };
  }

  componentDidMount() {
    db.collection('datosUsuario').where('owner', '==', auth.currentUser.email).onSnapshot(
      docs => {
          docs.forEach(doc => { //doc es un array
              const data = doc.data();
              this.setState({
                  datosUsuario: data
              })

          })
      }
  )
    db.collection("posts")
      .orderBy("createdAt", "desc")
      .onSnapshot(docs => {
        let posts = [];

        docs.forEach(doc => {
          const data = doc.data();
          const id = doc.id;
          posts.push({ data, id }); //? por qué usamos los corchetes acá?
          //! la información se guarda dentro del data, por eso despues hacemos postData.data. En el console.log se ve claramente esto. 
        });

        this.setState({
          // posts: [...this.state.posts, postDataConId]
          posts: posts,
          loader: false,
        });
      });
  }

  desloguear() {
    auth.signOut();
    this.props.navigation.navigate("Login");
  }

  render() {
    console.log(this.state.posts)
    return (
      <ScrollView style={{backgroundColor: 'grey'}}>
        {this.state.loader ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          // <> </>
          <View style={styles.allPost}>
            <FlatList
              data={this.state.posts}
              keyExtractor={item => item.id.toString()} //Todo: pregutnar qué sería item en este caso?
              renderItem={({ item }) => <Posts navigation={this.props.navigation} datosUsuario={this.state.datosUsuario} postData={item} />} //* Aca pase navigation como prop porque no me la estaba reconociendo. 
            />
          </View>
        )}
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  allPost: {
    flexDirection: 'column',
    maxHeight: '1200px'

  }, 
  contenedor: {
    textAlign: "center",
    padding: 10,
  }
});
export default Home;
