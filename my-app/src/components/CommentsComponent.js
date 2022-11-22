import { Component } from "react";
import CorrectDate from "./CorrectDate";
import IconoUsuario from "./IconoUsuario";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import { db, auth } from '../firebase/config';
import CommentReplies from "./CommentReplies";
import firebase from "firebase";

class CommentsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reply: false,
            respuestaComentario: "",
            comentario: "",
            datosUsuario: null
        
        }
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
    }

    replyToComment() {
        this.setState({
            reply: true
        })
    }
    cancelReplyToComment() {
        this.setState({
            reply: false
        })

    }

    uploadReplyToComment() {
        if (this.state.respuestaComentario === "" || this.state.respuestaComentario === false) {
            alert("You have to type something")
        }
        else {
            db.collection("posts")
                .doc(this.props.idComment)
                .collection("comments")
                .doc(this.props.commentsId)
                .update({
                    replies: firebase.firestore.FieldValue.arrayUnion({ owner: this.state.datosUsuario.username, textReply: this.state.respuestaComentario, createdAt: Date.now() })
                })
                .then(() => {
                    this.setState({
                        respuestaComentario: ""
                    })
                })
                .catch((e) => {
                    console.log(e)
                })
        }
    }

    render() {
        return (
            <View>
                <View style={styles.commentBox}>
                    <View>
                        <IconoUsuario nombreUsuario={this.props.commentsData.owner} />
                    </View>
                    <View style={styles.commentsData}>
                        <View style={styles.commentInfo}>
                            <Text style={styles.username}>{this.props.commentsData.owner}</Text>
                            <Text style={styles.commentText}> {this.props.commentsData.text}</Text>
                        </View>
                        <View style={styles.commentInfo}>
                            <View style={styles.date}>
                                <CorrectDate createdAt={this.props.commentsData.createdAt}/>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => this.replyToComment()}>
                                    <Text style={{fontWeight: '500'}}> Reply </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            {this.state.reply && (
                                    <View
                                        style={{
                                            marginBottom: 5,
                                            width: '100%',
                                            marginLeft: '12px',
                                            borderLeftWidth: 'thick',
                                            borderLeftColor: '#e6e6e6'
                                        }}
                                    >
                                        <View style={{ paddingHorizontal: '10px'}}>
                                            <View>
                                                <View style={styles.cajaReply}>
                                                    <View>
                                                        <TextInput 
                                                            multiline={true}
                                                            style={{borderWidth: 'none', flex: 1, flexWrap: 'wrap', maxHeight: 30}}
                                                            keyboardType="default"
                                                            placeholder="What are your thoughts?"
                                                            onChangeText={text => this.setState({ respuestaComentario: text})}
                                                            value={this.state.respuestaComentario}
                                                        />
                                                    </View>
                                                    <View style={{
                                                        flexDirection: 'row', alignSelf: 'flex-end', paddingHorizontal: '14px',height: '30px'

                                                    }}>
                                                        <View style={{justifyContent: 'center', marginRight:'3px'}}>
                                                            <TouchableOpacity activeOpacity={0.8} onPress={() => this.cancelReplyToComment()}>
                                                                <Text> Cancel </Text>
                                                            </TouchableOpacity>

                                                        </View>

                                                        <View style={{ backgroundColor: 'forestgreen', opacity: 0.8, justifyContent: 'center', borderRadius: 5}}>
                                                            <TouchableOpacity activeOpacity={0.8} onPress={() => this.uploadReplyToComment()}>
                                                                <Text style={{color: 'white', textAlign: 'center'}}> Respond </Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>

                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            <View style={styles.replies}>
                                <CommentReplies commentReplies={this.props.commentsData.replies} />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    commentBox: {
        padding: 10,
        flexDirection: 'row'
    },
    commentIcon: {
        marginLeft: 20
    },
    commentInfo: {
        flexDirection: 'row',
        marginBottom: 5,
        marginLeft: 5
    },
    commentsData: {
        marginLeft: 5
    },
    username: {
        marginRight: 8,
        fontWeight: 'bold'
    },
    date: {
        marginRight: 8,
        marginLeft: -3
    },
    cajaReply: {
        paddingVertical: '15px',
        paddingHorizontal: '10px',
        backgroundColor: 'white',
        borderRadius: 3,
        flexDirection: "column",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
    replies: {padding: 20},
    comment: {

    },
    userIcon: {}
})

export default CommentsComponent