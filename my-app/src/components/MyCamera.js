import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Camera } from "expo-camera";
import { auth, db, storage } from '../firebase/config';

class MyCamera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permission: false,
      url: '',
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
          url: photo.uri, //Es una uri interna temporal de la foto.
          showCamera: false, //* una vez tomada la foto ocultaremos la camara.
        });
      });
  }

  savePhoto() {
    fetch(this.state.url)
      .then((res) => res.blob()) //* Puedo tener la representación binaria de la imágen
      .then((image) => {
        const ref = storage.ref(`photos/${Date.now()}.jpg`);
        //Todo: Pregutnar qué hace ref
        ref.put(image) //* Subo a firebase el archivo 
          .then(() => {
            ref.getDownloadURL()
              .then((url) => {
                this.props.onImageUpload(url);
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
      showCamera: true,
      url: ''
    })
    //* En caso de que rechaze la imagen, recargaría página.

  }

  render() {
    return (
      <React.Fragment>
        {
          this.state.permission
            ?
            this.state.showCamera === false
              ?
              <React.Fragment>

                <View style={styles.preview}>
                  <Image source={{ uri: this.state.url }} style={styles.previewImage} />
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity onPress={() => this.savePhoto()}>
                      <Text style={styles.buttons}>Keep</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.clearPhoto()}>
                      <Text style={styles.buttons}>Retake</Text>
                    </TouchableOpacity>
                  </View>
                </View>

              </React.Fragment>
              :
              <View style={styles.preview}>
                <View style={{height: 300, width: 300, marginTop: 5}}>

                <Camera
                  style={styles.camera}
                  type={Camera.Constants.Type.front}
                  ref={(metodosDeCamara) => {
                    return (this.metodosDeCamara = metodosDeCamara);
                  }}
                  //* Esta función va a ser agregada al objeto this.
                  //* Forma de controlar componente hijo a través del padre
                  />
                
                </View>
                <View>

                  <TouchableOpacity onPress={() => this.takePicture()}
                  >
                    <Text style={styles.buttons}>Shoot</Text>
                  </TouchableOpacity>
                </View>

              </View>
            :
            <Text>
              You need permission to take a picture
            </Text>
        }

      </React.Fragment>
    );
  }
}
const styles = StyleSheet.create({
  camera: {
    flex: 1,
    height: 300,
    width: 300,
    borderRadius: 20
  },
  previewImage: {
    height: 300,
    width: 300,
    borderRadius: 20
  },
  buttons: {
    color: 'white',
    textAlign: 'center',
    margin: 3,
    backgroundColor: 'forestgreen',
    margin: 10,
    padding: 15,
    borderRadius: 20,
    fontWeight: 'bold',
  },
  preview: {
    alignItems: 'center',
    backgroundColor: 'darkseagreen',
    borderRadius: 20
  }
})

export default MyCamera;
