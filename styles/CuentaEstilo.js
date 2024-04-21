import { StyleSheet } from "react-native";

export const CuentaStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    margin: 30,
    padding: 10,
    elevation: 3,
    maxHeight: "90%",
    width: "90%",
    alignSelf: "center",
  },
  header: {
    backgroundColor: "#1C2120",
    height: 90,
    marginBottom: 20,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
    textAlign: "center",
  },
  meca: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1C2120",
    textAlign: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 70,
    marginBottom: 15,
  },
  text: {
    marginLeft: 5,
    fontSize: 16,
    color: "#1C2120",
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 180,
    height: 200,
    marginBottom: 7,
    alignSelf: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#1C2120",
  },
});
