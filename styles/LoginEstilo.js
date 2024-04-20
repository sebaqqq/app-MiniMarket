import { StyleSheet } from 'react-native';

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
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#0077B6",
  },
  logoImage: {
    width: 180,
    height: 200,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0077B6",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputWrapper: {
    position: "relative",
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
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingVertical: 8,
    paddingLeft: 40,
    color: "#333",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: "#0077B6",
    borderRadius: 20,
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
    color: "#0077B6",
    marginTop: 10,
    fontSize: 12,
  },
});