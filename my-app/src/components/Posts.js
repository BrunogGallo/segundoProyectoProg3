import React, { Component } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { auth, db } from "../firebase/config";
import firebase from "firebase";
import IconoUsuario from "./IconoUsuario";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart'
import { faComment } from '@fortawesome/free-solid-svg-icons/faComment'
import CorrectDate from "./CorrectDate";

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: <FontAwesomeIcon size={32} icon={faHeart} />,
      liked: this.props.postData.data.likes.includes(auth.currentUser.email),
      comment: "",
      commentIcon: <FontAwesomeIcon size={32} icon={faComment} />,
      comments: ''
    };
  }
  componentDidMount() {
    db.collection("posts")
      .doc(this.props.postData.id)
      .collection("comments")
      //* Como no quiero traerme toda la colleción, puede utilizar doc para identificar el usuario específico. 
      .onSnapshot(docs => {
        let comments = [];

        docs.forEach(doc => {
          const data = doc.data();
          const id = doc.id;
          comments.push({ data, id });
        });
        this.setState({
          comments: comments
        });
      });

  }
  dislike() {
    db.collection("posts")
      .doc(this.props.postData.id)
      .update({
        likes: firebase.firestore.FieldValue.arrayRemove(
          auth.currentUser.email //Todo: Preguntar si es lo mismo usar eso que auth.currentUser
        )
      })
      .then(() => this.setState({ liked: false, icon: <FontAwesomeIcon size={32} icon={faHeart} /> }));
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
          icon: <FontAwesomeIcon color='red' size={32} icon={faHeart} />,
        })
      );
  }
  goToCommentsPage() {
    this.props.navigation.navigate('Comments', { itemId: this.props.postData.id, posts: this.props.postData.data })
    //* Aca lo que estoy haciendo es pasarle información mediante un objeto literal para despues mostrarlo en esa página 
  }
  //! La verdadera es Comments
  render() {
    console.log(this.props.postData.data.ownerUsername);
    return (

      <View style={styles.post}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { owner: this.props.postData.data.owner })}>
          <View style={styles.upperPartOfPost}>

            <View style={{ flex: 1 }}>
              
              <IconoUsuario nombreUsuario={this.props.postData.data.ownerUsername} />
            </View>
            <View style={{ flex: 8, justifyContent: 'center', alignItems: 'flex-start', marginLeft: 10 }}>
              <Text style={{ fontWeight: 'bold' }}> {this.props.postData.data.ownerUsername}</Text>
            </View>

          </View>
        </TouchableOpacity>
        <View>
          <View style={{ backgroundColor: 'green' }}>
            <Image source={{ uri: this.props.postData.data.photo }}
              style={styles.image}
              resizeMode='cover'
            />
          </View>
        </View>
        <View>
          <View style={styles.likesAndCommentsSection}>
            <View>
              {this.state.liked ? (
                <View style={{ flexDirection: 'row' }}>
                <View>
                <TouchableOpacity onPress={() => this.dislike()}>
                  <Text style={styles.button}>  {this.state.icon}</Text>
                </TouchableOpacity>
                </View>
                <View style={{ paddingTop: 4 }}>
                  <Text> ({this.props.postData.data.likes.length})</Text>
                </View>
              </View>
                
                
              ) : (
                <View style={{ flexDirection: 'row' }}>
                <View>
                <TouchableOpacity onPress={() => this.like()}>
                  <Text style={styles.button}> {this.state.icon}</Text>
                </TouchableOpacity>
                </View>
                <View style={{ paddingTop: 4 }}>
                  <Text> ({this.props.postData.data.likes.length})</Text>
                </View>
              </View>
                
              )}
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View>
                <TouchableOpacity >
                  <Text style={{ fontSize: 23 }} onPress={() => this.goToCommentsPage()}> {this.state.commentIcon} </Text>
                </TouchableOpacity>
              </View>
              <View style={{ paddingTop: 4 }}>
                <Text> ({this.state.comments.length})</Text>
              </View>
            </View>
          </View>
          <View>
            <View style={{ flexDirection: 'row', padding: 9 }}>
              <View>
                <Text style={{ fontWeight: 'bold' }}> {this.props.postData.data.ownerUsername} </Text>
              </View>
              <View style={{ marginLeft: -3 }}>
                <Text> {this.props.postData.data.postContent} </Text>
              </View>
            </View>
            <View style={{ padding: 9 }}>
              <CorrectDate createdAt={this.props.postData.data.createdAt} />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  post: {
    margin: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,

    elevation: 1
  },
  image: {
    height: 300,
  },
  upperPartOfPost: {
    flexDirection: "row",
    borderRadius: 20,
    paddingLeft: 10,
    paddingVertical: 10
  },
  likesAndCommentsSection: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-around',
  },
  notLikeAndCommentSection: {
    padding: 40
  },
  lowerSection: {
    flexDirection: 'column'
  },
  button: {
    fontSize: 23,
    fontWeight: 'bold'
  }
});

export default Posts;
