import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { auth, db } from "../firebase/config";
import firebase from "firebase";
class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "Like",
      liked: this.props.postData.data.likes.includes(auth.currentUser.email),
    };
  }

  dislike() {
    db.collection("posts")
      .doc(this.props.postData.id)
      .update({
        likes: firebase.firestore.FieldValue.arrayRemove(
          auth.currentUser.email //Todo: Preguntar si es lo mismo usar eso que auth.currentUser
        )
      })
      .then(() => this.setState({ liked: false, text: "Like" }));
    //Todo: Pregutnar para qué se usa el ()=>
  }

  like() {
    db.collection("posts")
      .doc(this.props.postData.id)
      .update({
        likes: firebase.firestore.FieldValue.arrayUnion(
          auth.currentUser.email
        )
      })
      .then(() =>
        this.setState({
          liked: this.props.postData.data.likes.includes(
            auth.currentUser.email
          ), //Todo: Preguntar si podría poner true aca
          text: "Dislike",
        })
      );
  }

  render() {
    return (
      <React.Fragment>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
          <Text style={styles.text}> {this.props.postData.data.owner}</Text>
        </TouchableOpacity>
        <Text style={styles.text}> {this.props.postData.data.title}</Text>
        <Text style={styles.button}>
          {this.props.postData.data.postContent}
        </Text>
        <Text style={styles.button}>
          likes: {this.props.postData.data.likes.length}
        </Text>

        {this.state.liked ? (
          <TouchableOpacity onPress={() => this.dislike()}>
            <Text style={styles.button}> {this.state.text}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => this.like()}>
            <Text style={styles.button}> {this.state.text}</Text>
          </TouchableOpacity>
        )}
      </React.Fragment>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    color: "red",
    fontSize: 25,
  },
  text: {
    fontSize: 25,
  },
});

export default Posts;
