import { StyleSheet } from "react-native";

export const LoginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  centeredContainer: {
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1C2120",
  },
  Subtitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#D4D4D4",
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 50,
    color: "#1C2120",
  },
  headerTextrecuperar: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 50,
    color: "#1C2120",
  },
  inputContainer: {
    width: "80%",
    marginBottom: 20,
  },
  inputWrapper: {
    position: "relative",
    marginTop: 20,
    marginBottom: 20,
  },
  icon: {
    position: "absolute",
    left: 8,
    top: 12,
  },
  labelContainer: {
    position: "absolute",
    top: 0,
    left: 4,
  },
  labelText: {
    fontSize: 14,
  },
  input: {
    width: "100%",
    backgroundColor: "#D4D4D4",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingVertical: 8,
    paddingLeft: 40,
    color: "#333",
    borderRadius: 10,
  },
  inputRecupear: {
    width: "80%",
    backgroundColor: "#D4D4D4",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingVertical: 8,
    paddingLeft: 40,
    marginBottom: 20,
    color: "#333",
    borderRadius: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: "#1C2120",
    borderRadius: 10,
    paddingVertical: 12,
    width: "80%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  showPasswordButton: {
    position: "absolute",
    right: 8,
    top: 12,
  },
  forgotPasswordText: {
    color: "#1C2120",
    marginTop: 10,
    fontSize: 12,
  },
  final: {
    flexDirection: "row",
    alignItems: "flex-end",
    width: "100%",
  },
  logoImagefinal: {
    width: 150,
    height: 150,
    marginLeft: "-22%",
    marginRight: "-20%",
    marginTop: "-20%",
    marginBottom: "-5%",
  },
});
