import { StyleSheet } from 'react-native';

export const EditarUserStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  textTitle: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userData: {
    marginBottom: 20,
  },
  userDataText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: "100%",
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333333",
  },
  boton: {
    backgroundColor: "#0077B6",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  botonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
