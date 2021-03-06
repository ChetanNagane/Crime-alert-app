import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../colors";
import BottomPopup from "../components/BottomPopup";
import CustomTouchable from "../components/CustomTouchable";
import Input from "../components/Input";
import {
  addRelative,
  getAllRelative,
  updateRelative,
  deleteRelative,
} from "../store/actions/relative";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";

const iconColors = ["orange", "green", "lightblue"];

const RelativesScreen = (props) => {
  // Fetch relatives here
  const relatives = useSelector((state) => state.relative.relatives);

  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState("");

  const [isDataValid, setIsDataValid] = useState({
    firstname: false,
    lastname: true,
    email: true,
    mobileNumber: false,
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const setValid = (field, value) => {
    setIsDataValid((prevValue) => ({ ...prevValue, [field]: value }));
    let formValid = Object.values(isDataValid).reduce(
      (prev, cur) => prev && cur
    );
    setIsFormValid(() => formValid);
  };

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            iconName={Platform.OS === "ios" ? "ios-add" : "md-add"}
            color={colors.textSecondary}
            onPress={() => {
              setModalVisible(true);
              setIsEdit(false);
            }}
          />
        </HeaderButtons>
      ),
    });
    async function getData() {
      setIsFetching(true);
      await dispatch(getAllRelative());
      setIsFetching(false);
    }
    getData();
  }, []);

  useEffect(() => {
    setIsDataValid({
      firstname: isEdit,
      lastname: true,
      email: true,
      mobileNumber: isEdit,
    });
  }, [isEdit]);

  const onRelativeEdit = (id) => {
    const relative = relatives.filter((relative) => relative._id === id);
    setEditData(() => relative[0]);
  };

  const editRelativeHandler = async (values) => {
    setError(null);
    setIsLoading(true);
    try {
      if (values !== editData) {
        await dispatch(updateRelative(values, editData._id));
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRelativeHandler = async (id) => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(deleteRelative(id));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 20, borderRadius: 20, zIndex: -2 }}>
        {isFetching ? (
          <ActivityIndicator size="large" color={colors.backgroundPrimary} />
        ) : relatives.length ? (
          relatives.map((relative, index) => (
            <View style={styles.card} key={relative._id}>
              <View
                style={{
                  ...styles.cardIcon,
                  ...{
                    backgroundColor: iconColors[index % iconColors.length],
                  },
                }}
              >
                <FontAwesome name="user" size={27} color="white" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>
                  {relative.firstname} {relative.lastname}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#b0b0b0",
                    fontWeight: "bold",
                    marginBottom: 3,
                  }}
                >
                  {relative.mobileNumber}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    color: "#b0b0b0",
                    fontWeight: "bold",
                    marginBottom: 3,
                  }}
                >
                  {relative.email}
                </Text>
              </View>
              <View style={{ marginLeft: 40 }}>
                <CustomTouchable
                  onPress={() => {
                    setIsEdit(() => true);
                    setModalVisible(true);
                    onRelativeEdit(relative._id);
                  }}
                >
                  <MaterialIcons
                    style={{ marginBottom: 10 }}
                    name="edit"
                    size={24}
                    color="black"
                  />
                </CustomTouchable>
                <CustomTouchable
                  onPress={() => {
                    deleteRelativeHandler(relative._id);
                  }}
                >
                  <MaterialIcons name="delete" size={24} color="red" />
                </CustomTouchable>
              </View>
            </View>
          ))
        ) : (
          <Text>No friend found!!</Text>
        )}
      </View>

      {isLoading ? (
        <View style={{ marginVertical: "40%" }}>
          <ActivityIndicator size="large" color={colors.backgroundPrimary} />
        </View>
      ) : (
        <BottomPopup
          modalVisible={modalVisible}
          closeModal={() => {
            setIsFormValid(() => false);
            setModalVisible(false);
            setIsEdit(false);
          }}
        >
          <Pressable
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <ScrollView>
              <View style={styles.centeredView}>
                <View style={{ padding: 10, flexDirection: "row" }}>
                  <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                    {isEdit ? "Update Friend" : "New Friend"}
                  </Text>
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      left: "65%",
                      marginTop: 4,
                    }}
                    onPress={() => {
                      setModalVisible(false);
                    }}
                  ></TouchableOpacity>
                </View>

                <Formik
                  initialValues={{
                    firstname: isEdit ? editData.firstname : "",
                    lastname: isEdit ? editData.lastname : "",
                    mobileNumber: isEdit ? editData.mobileNumber + "" : "",
                    email: isEdit ? editData.email : "",
                  }}
                  onSubmit={(values) => {
                    isEdit
                      ? editRelativeHandler(values)
                      : (async function () {
                          setError(null);
                          setIsLoading(true);
                          try {
                            await dispatch(addRelative(values));
                          } catch (error) {
                            setError(error.message);
                          } finally {
                            setIsLoading(false);
                          }
                        })();
                  }}
                >
                  {({ values, handleChange, handleSubmit }) => {
                    return (
                      <View>
                        <Input
                          name="firstname"
                          value={values.firstname}
                          setValid={setValid}
                          config={{ placeholder: "Firstname" }}
                          style={styles.modalFormInput}
                          handleChange={handleChange("firstname")}
                          styleError={styles.error}
                        />
                        <Input
                          name="lastname"
                          value={values.lastname}
                          setValid={setValid}
                          config={{ placeholder: "Lastname" }}
                          style={styles.modalFormInput}
                          handleChange={handleChange("lastname")}
                          disableError={"false"}
                        />
                        <Input
                          name="mobileNumber"
                          value={values.mobileNumber}
                          setValid={setValid}
                          config={{
                            placeholder: "Mobile Number",
                            keyboardType: "number-pad",
                          }}
                          style={styles.modalFormInput}
                          handleChange={handleChange("mobileNumber")}
                          styleError={styles.error}
                        />
                        <Input
                          name="email"
                          value={values.email}
                          setValid={setValid}
                          config={{ placeholder: "Email" }}
                          style={styles.modalFormInput}
                          handleChange={handleChange("email")}
                          disableError={"false"}
                        />

                        <TouchableOpacity
                          activeOpacity={isFormValid ? 0.5 : 1}
                          style={{
                            ...styles.openButton,
                            backgroundColor: isFormValid
                              ? "#2196F3"
                              : "#7fc4fa",
                          }}
                          onPress={
                            isFormValid
                              ? () => {
                                  setModalVisible(() => false);
                                  handleSubmit();
                                }
                              : () => {}
                          }
                        >
                          <Text style={styles.textStyle}>
                            {isEdit ? "Edit Friend" : "Add Friend"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                </Formik>
              </View>
            </ScrollView>
          </Pressable>
        </BottomPopup>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: 400,
    maxWidth: "90%",
    height: 100,
    marginTop: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    borderRadius: 20,
    flexDirection: "row",
    backgroundColor: "white",
    elevation: 5,
    zIndex: -1,
  },
  cardInfo: {
    marginLeft: 15,
    flex: 1,
  },
  cardName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#666767",
    marginBottom: 3,
  },
  modalView: {
    margin: 20,
    marginTop: "30%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
    marginBottom: 10,
    marginTop: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  centeredView: {
    zIndex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  modalFormInput: {
    borderWidth: 1,
    width: 300,
    borderRadius: 10,
    padding: 8,
    fontSize: 20,
    marginBottom: 20,
  },
  error: {
    marginTop: -15,
    fontSize: 15,
    color: "red",
  },
});

export default RelativesScreen;
