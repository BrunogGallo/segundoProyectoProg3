import { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import { db, auth} from '../firebase/config';
import CommentsComponent from "../components/CommentsComponent";
import moment from 'moment/moment'

class CommentsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
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
        db.collection("posts")
            //   .orderBy("createdAt", "asc") //? Hace falta hacer un order by aca?
            .doc(this.props.route.params.itemId)
            .collection("comments")
            .orderBy("createdAt", "desc") //? Hace falta hacer un order by aca?
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
                .collection("comments")
                .add({
                    owner: this.state.datosUsuario.username,
                    text: this.state.comentario,
                    createdAt: Date.now(),
                    replies: []
                })
                .then(() => {
                    this.setState({
                        comentario: ""
                    })
                })
                .catch((e) => {
                    console.log(e)
                })
        }
    }

    render() {
        console.log(this.state.datosUsuario);
        //Todo: mostrar solo si el hay comentarios
        return (
            <View style={{width: '100%'}}>
                    <View style={styles.commentTitle}>
                        <Text style={styles.commentTitleText}> Comments ({this.state.comments.length}) </Text>
                    </View>
                    <View>
                        <View style={{ paddingHorizontal: '10px' }}>
                            <View>
                                <View style={styles.cajaReply}>
                                    <View>
                                        <TextInput
                                            multiline={true}
                                            style={{ borderWidth: 'none', flexWrap: 'wrap', maxHeight: 30 }}
                                            keyboardType="default"
                                            placeholder="What are your thoughts?"
                                            placeholderTextColor={'grey'}
                                            onChangeText={text => this.setState({ comentario: text })}
                                            value={this.state.comentario}
                                        />
                                    </View>
                                    <View style={{
                                        flexDirection: 'row', alignSelf: 'flex-end', paddingHorizontal: '14px', height: '30px'

                                    }}>
                                        <View style={{ backgroundColor: 'forestgreen', opacity: 0.8, justifyContent: 'center', borderRadius: 5}}>
                                            <TouchableOpacity activeOpacity={0.8} onPress={() => this.uploadComment()}>
                                                <Text style={{ color: 'white', textAlign: 'center' }}> Post </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.commentAll}>
                        <FlatList
                            data={this.state.comments}
                            keyExtractor={item => item.data.createdAt.toString()}
                            renderItem={({ item }) => <CommentsComponent idComment={this.props.route.params.itemId} commentsData={item.data} commentsId={item.id} />}
                        />
                    </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    commentAll: {
        padding: 10
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
    commentTitleText: {
        fontSize: '20px'
    },
    commentTitle: {
        padding: 10
    }

})
export default CommentsScreen