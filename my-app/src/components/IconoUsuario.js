import {View, Text} from 'react-native'
function IconoUsuario ({nombreUsuario}) {
    const usernameToIcon = nombreUsuario.slice(0,1).toUpperCase();
    return (
        <View style={{
            backgroundColor: 'blue',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 30,
            width: 45,
            height: 45,
          }}>
            <Text style={{ color: 'white', fontSize: 22, textAlign: 'center'}}> {usernameToIcon}</Text>
        </View>
    )
}
export default IconoUsuario