import React, { Component } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
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
    };
  }

  componentDidMount() {
    db.collection("posts")
    //   .orderBy("createdAt", "asc")
    //   .limit(3)
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
      <React.Fragment>
        <View style={styles.contenedor}>

          {this.state.loader ? (
            <ActivityIndicator size="large" color="black" />
          ) : (
            // <> </>
            <FlatList
              data={this.state.posts}
              keyExtractor={item => item.id.toString()} //Todo: pregutnar qué sería item en este caso?
              renderItem={({ item }) => <Posts postData={item} navigation={this.props.navigation}/>}
            />
          )}
        </View>
      </React.Fragment>
    );
  }
}
const styles = StyleSheet.create({
  contenedor: {
    textAlign: "center",
    padding: 10,
  },
  image: {
    height: 400,
  },
});
export default Home;
