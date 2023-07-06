import { StyleSheet, Dimensions, StatusBar } from "react-native";
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },

  button: {
    backgroundColor: "white",
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 35,
    marginHorizontal: 20,
    marginVertical: 10,
    borderWidth: 3,
    borderColor: "black",
  },

  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "black",
    letterSpacing: 0.5,
  },

  bottomContainer: {
    justifyContent: "center",
    height: height / 3,
  },

  textInput: {
    borderWidth: 3,
    color: "black",
    height: 50,
    backgroundColor: "white",
    borderWidth: 3,
    textDecorationColor: "black",
    borderColor: "black",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 25,
    paddingLeft: 10,
  },

  formButton: {
    backgroundColor: "white",
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 35,
    marginHorizontal: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "black",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  formInputContainer: {
    marginBottom: 70,
    ...StyleSheet.absoluteFill,
    zIndex: -1,
    justifyContent: "center",
  },

  closeButtonContainer: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 1,
    backgroundColor: "black",
    borderWidth: 2,
    alignItems: "center",
    borderRadius: 20,
    top: Platform.OS === "ios" ? -20 : 20,
    borderTopColor: "white",
    borderRightColor: "white",
    borderLeftColor: "white",
    borderBottomColor: "white",
  },

  headerContainer: {
    flexDirection: "row",
    marginTop: 180,
    justifyContent: "center",
  },

  header: {
    marginTop: 40,
    backgroundColor: "white",
    opacity: 0.9,
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "black",
    alignContent: "center",
  },

  headerText: {
    fontWeight: "bold",
    marginHorizontal: 8,
    color: "black",
    fontSize: 35,
  },
  
});

export default styles;