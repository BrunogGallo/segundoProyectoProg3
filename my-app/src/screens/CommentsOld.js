import { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import { db, auth } from '../firebase/config';
import IconoUsuario from "../components/IconoUsuario";
import CorrectDate from "../components/CorrectDate";
import firebase from 'firebase';

class CommentsOld extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            comentario: "",
            datosUsuario: null,
            respuestaComentario: "",
            reply: false
        }
    }
    componentDidMount() {
        db.collection("posts")
            //.orderBy("createdAt", "asc") //? Hace falta hacer un order by aca?
            .doc(this.props.route.params.itemId)
            //* Como no quiero traerme toda la colleción, puede utilizar doc para identificar el usuario específico. 
            .onSnapshot(doc => {
                //* es un tema de nombre, pero lo llamamos doc porque solo nos trae la información de un documento, no de toda la colleción. 
                this.setState({
                    comments: doc.data().comments
                })
                

            })
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

    uploadComment() {
        if (this.state.comentario === "" || this.state.comentario === false) {
            alert("You have to type something")
        }
        else {
            db.collection("posts")
            //*Decidí crear una colleción específica para los comentarios porque averigue que en firestore no podías actualizar array u objetos dentro de un documento
            //* Tenes comments: {createdAt, owner, text, replies: []}. 
            //* Ya lo que está dentro de replies no se puede tocar. No puedo actualizar los valores dentro de la misma. Eso es mi problema actual.
                .doc(this.props.route.params.itemId)
                .update({
                    comments: firebase.firestore.FieldValue.arrayUnion(
                        { owner: this.state.datosUsuario.username, text: this.state.comentario, createdAt: Date.now(), commentReplies: [] }
                    )
                })
                .then(() => {
                    this.setState({
                        comentario: "",
                    })
                })
                .catch((e) => {
                    console.log(e)
                })
        }
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
                .doc(this.props.route.params.itemId)
                .update({
                    comments: firebase.firestore.FieldValue.arrayUnion(
                        {
                            commentReplies: [
                                { owner: this.state.datosUsuario.username, textReply: this.state.respuestaComentario, createdAt: Date.now() }
                                //* Aca estaría actualiando commentReply con el comentario del usuario
                            ]
                        }
                    )
                }, () => { console.log(this.state.comments) })
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
        console.log(this.state.comments);
        //Todo: mostrar solo si el hay comentarios
        return (
            <View>
                <View >
                    <Text style={styles.commentTitle}> Comments </Text>
                    <FlatList
                        data={this.state.comments}
                        keyExtractor={item => item.createdAt.toString()} //Todo: Porqué asignamos item.createdAt en vez de index
                        renderItem={({ item }) =>
                            //! Aca estamos desestructurando el objeto item, que tiene elementos como item o index dentro. A nosotros nos importa el item dentro del item
                            //! Si quisiesemos, podríamos escribir item.item sin desestructurar. 

                            <View style={styles.commentBox}>
                                <View style={styles.commentIcon}>
                                    <IconoUsuario nombreUsuario={item.owner} />
                                </View>
                                <View>
                                    <View style={styles.commentInfo}>
                                        <Text style={styles.username}>{item.owner}</Text>
                                        <CorrectDate style={styles.date} createdAt={item.createdAt} />
                                    </View>
                                    <View style={styles.commentText}>
                                        <Text> {item.text}</Text>
                                    </View>
                                    <View>
                                        <View>
                                            <TouchableOpacity onPress={() => this.replyToComment()}>
                                                <Text> Reply </Text>
                                            </TouchableOpacity>
                                            {this.state.reply && (
                                                <View>
                                                    <View>
                                                        <TextInput style={styles.comment}
                                                            keyboardType="default"
                                                            placeholder="Write something"
                                                            onChangeText={text => this.setState({ respuestaComentario: text })}
                                                            value={this.state.respuestaComentario}
                                                        />
                                                    </View>
                                                    <View>
                                                        <View>
                                                            <TouchableOpacity onPress={() => this.uploadReplyToComment()}>
                                                                <Text> Post </Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                        <View> 
                                                        <TouchableOpacity onPress={() => this.cancelReplyToComment()}>
                                                                <Text> Cancel </Text>
                                                            </TouchableOpacity>

                                                        </View>
                                                    </View>
                                                </View>
                                            )}
                                        </View>
                                        {/* <View> 
                                            <CommentReplies commentReplies={item.commentReplies}/> //! aca pasamos el array de respuestas
                                        </View> */}
                                    </View>
                                </View>
                            </View>}
                    />
                    <TextInput style={styles.comment}
                        keyboardType="default"
                        placeholder="Write something"
                        onChangeText={text => this.setState({ comentario: text })}
                        value={this.state.comentario}
                    />
                    <TouchableOpacity onPress={() => this.uploadComment()}>
                        <Text> Post </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    commentBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10
    },
    commentIcon: {
        marginLeft: 20,
        marginRight: 15
    },
    commentInfo: {
        flexDirection: 'row',
        marginBottom: 5
    },
    username: {
        marginRight: 10
    },
    comment: {},
    userIcon: {}
})
export default CommentsOld