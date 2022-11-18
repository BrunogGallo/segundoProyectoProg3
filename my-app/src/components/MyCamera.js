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
      photoTaken: true
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
                this.setState({
                  photoTaken: false
                })
                //? Qué hace aca?
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
              {this.state.photoTaken?             <View style={styles.buttonArea}>
              <TouchableOpacity onPress={() => this.savePhoto()}>
                <Text style={styles.botones}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.clearPhoto()}>
                <Text style={styles.botones}>Rechazar</Text>
              </TouchableOpacity>
            </View>: <> </>}
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
    height: '50vh',
    width: '100%',
    position: 'absolute'
  },
  preview: {
    height: 200,
    width: 200
  },
  buttonArea: {
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  botones: {
    backgroundColor: 'blue',
    fontSize: 20,
    borderRadius: 1,
    margin: 10
  },
  shootButton: {
    alignItems: 'center'
  }
})

export default MyCamera;
