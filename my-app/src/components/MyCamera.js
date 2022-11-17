import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Camera } from "expo-camera";
import { auth, db, storage } from '../firebase/config';

class MyCamera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permission: false,
      photo: "",
      showCamera: true,
    };
  }

  componentDidMount() {
    Camera.requestCameraPermissionsAsync()
      .then(() => {
        this.setState({
          permission: true,
        });
      })
      .catch((e) => console.log(e));
  }

  takePicture() {
    this.metodosDeCamara.takePictureAsync().
      then((photo) => {
        this.setState({
          photo: photo.uri, //Es una uri interna temporal de la foto.
          showCamera: false, //* una vez tomada la foto ocultaremos la camara.
        });
      });
  }

  savePhoto() {
    fetch(this.state.photo)
      .then((res) => res.blob()) //* Puedo tener la representación binaria de la imágen
      .then((image) => {
        const ref = storage.ref(`photos/${Date.now()}.jpg`);
        //Todo: Pregutnar qué hace ref
        ref.put(image) //* Subo a firebase el archivo 
          .then(() => {
            ref.getDownloadURL()
              .then((url) => {
                this.props.onImageUpload(url);
              })
              .catch((e) => console.log(e));
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e)); //Todo: en el proyecto hacer lo que corresponda
  }

  clearPhoto() {
    this.setState({
      showCamera: true
    })
    //* En caso de que rechaze la imagen, recargaría página.

  }

  render() {
    return (
      <React.Fragment>
        {this.state.permission ?  this.state.showCamera === false ?
          <React.Fragment>
            <Image source={{ uri: this.state.photo }}
              style={styles.preview} />
            <View style={styles.buttonArea}>
              <TouchableOpacity onPress={() => this.savePhoto()}>
                <Text style={styles.aceptoRech}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.clearPhoto()}>
                <Text style={styles.aceptoRech}>Rechazar</Text>
              </TouchableOpacity>
            </View>
          </React.Fragment>
          :
          <View>
            <Camera
              style={styles.cameraBody}
              type={Camera.Constants.Type.front}
              ref={(metodosDeCamara) => {
                return (this.metodosDeCamara = metodosDeCamara);
              }}
            //* Esta función va a ser agregada al objeto this.
            //* Forma de controlar componente hijo a través del padre
            />
            <TouchableOpacity
              style={styles.shootButton}
              onPress={() => this.takePicture()}>
              <Text>Shoot</Text>
            </TouchableOpacity>
          </View>
          :
        <Text>
          You need permission to take a picture
        </Text>}

      </React.Fragment>
    );
  }
}
const styles = StyleSheet.create({
  cameraBody: {
    height: '100vh',
    width: '100vw',
    position: 'absolute'
  },
  preview: {
    height: 300,
    width: 300
  },
  buttonArea: {
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  botones: {
    backgroundColor: 'green',
    fontSize: 20,
    borderRadius: 5,
    margin: 10
  },
  shootButton: {
    alignItems: 'center'
  }
})
// const styles = StyleSheet.create({
//   shootButton: {
//     backgroundColor: "white",
//     height: 100,
//     width: 100,
//   },
//   cameraBody: {
//     width: 200,
//     height: 200,
//     justifyContent: 'center'
//   },
//   buttonArea: {
//     width: 100,
//     height: 100  },
//   preview: {
//     width: 200,
//     height: 200,
//     justifyContent: 'center'
//   },
//   aceptoRech: {
//     color: 'white'
//   }
// })

export default MyCamera;
