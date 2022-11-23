import { FlatList, Text, View, StyleSheet } from "react-native-web";
import CorrectDate from "./CorrectDate";
import IconoUsuario from "./IconoUsuario";
function CommentReplies({ commentReplies }) {
    return (
        <FlatList
            data={commentReplies}
            keyExtractor={item => item.createdAt.toString()}
            renderItem={({ item }) =>

                <View style={styles.commentInfo}>
                    <View style={styles.commentIcon}>
                        <IconoUsuario nombreUsuario={item.owner} />
                    </View>
                    <View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.username}>{item.owner}</Text>
                            <Text style={styles.commentText}> {item.textReply}</Text>
                        </View>
                        <View style={styles.date}>
                            <CorrectDate createdAt={item.createdAt} />
                        </View>

                    </View>
                </View>
            }
        />
    )
}
const styles = StyleSheet.create({
    commentIcon: {
        marginRight: 10
    },
    commentInfo: {
        flexDirection: 'row',
        marginBottom: 25,
        flex: 1,
    },
    username: {
        marginRight: 10,
        fontWeight: 'bold'
    }, 
    date: {
        marginLeft: -3
    }
})

export default CommentReplies