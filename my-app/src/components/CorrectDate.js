import moment from 'moment/moment'
import {View, Text} from 'react-native'
function CorrectDate ({createdAt}) {
    var date = moment(createdAt).format('MMMM Do YYYY, h:mm:ss a');
    return (
        <View>
            <Text> Published on {date}</Text>
        </View>
    )
}
export default CorrectDate;