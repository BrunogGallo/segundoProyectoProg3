import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Camera } from "expo-camera";

class AlfonMyCamera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permission: false,
      uriImage: "",
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
    this.metodosDeCamara.takePictureAsync().then((photo) => {
      this.setState({
        photo: photo.uri, //Es una uri interna temporal de la foto.
        showCamera: false, //* una vez tomada la foto ocultaremos la camara.
      });
    });
  }

  savePhoto() {
    fetch(this.state.photo)
      .then((res) => res.blob())
      .then((image) => {
        const ref = storage.ref(`photos/${Date.now()}.jpg`);
        ref.put(image).then(() => {
          ref.getDownloadURL().then((url) => {
            this.props.onImageUpload(url);
          });
        });
      })
      .catch((e) => console.log(e)); //Todo: en el proyecto hacer lo que corresponda
  }

  render() {
    return (
      <React.Fragment>
        <Camera
          style={styles.cameraBody}
          type={Camera.Constants.Type.back}
          ref={(metodosDeCamara) => {
            return (this.metodosDeCamara = metodosDeCamara);
          }}

          //* Esta función va a ser agregada al objeto this.
          // Forma de controlar componente
        />
        <TouchableOpacity
          style={styles.shootButton}
          onPress={() => this.takePicture()}
        >
          <Text>Shoot</Text>
        </TouchableOpacity>
        <View style={styles.buttonArea}>
          <TouchableOpacity onPress={() => this.savePhoto()}>
            <Text>Aceptar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("AddPost")}
            //* En caso de que rechaze la imagen, recargaría página.
          >
            <Text>Rechazar</Text>
          </TouchableOpacity>
        </View>
      </React.Fragment>
    );
  }
}
const styles = StyleSheet.create({
  shootButton: {
    backgroundColor: "white",
    height: "50px",
    width: "5px",
  },
  cameraBody: {
    width: "100px",
    height: "100px",
  },
});

export default AlfonMyCamera;
