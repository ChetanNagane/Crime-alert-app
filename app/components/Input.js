import React, { Fragment, useEffect, useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import { colors } from "../colors";
import { validations } from "../utils/validations";
import env from "../environment";

const Input = (props) => {
  const [focus, setFocus] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [exist, setExist] = useState(false);

  useEffect(() => {
    (async function checkValidation() {
      if (props.type !== "login") {
        if (props.disableError === "false") {
          setIsValid(() => true);
          return;
        } else {
          let isValid1;
          if (props.name === "confirmPassword") {
            console.log(props.value, props.password);
            isValid1 = validations[props.name]?.isValid(
              props.value,
              props.password
            );
          } else {
            let valid = true;
            if (props.checkExistOnServer) {
              const response = await fetch(
                `${env.API_URL}/user/check/${props.name}/${props.value}`
              );
              if (!response.ok) {
                valid = false;
              } else {
                const data = await response.json();
                const isExist = data.message;
                valid = !isExist;
                setExist(isExist);
              }
            }
            isValid1 = valid && validations[props.name]?.isValid(props.value);
          }
          props.setValid(props.name, isValid1);
          setIsValid(() => isValid1);
        }
      }
    })();
  }, [props.value, focus, props.name]);

  return (
    <Fragment>
      <TextInput
        value={props.value}
        onChangeText={props.handleChange}
        placeholder={props.name.charAt(0).toUpperCase() + props.name.slice(1)}
        style={{
          ...styles.input,
          ...{
            borderBottomColor: focus
              ? colors.backgroundAccent
              : colors.textPrimary,
          },
          ...props.style,
        }}
        spellCheck={false}
        onFocus={() => setFocus(true)}
        onBlur={() => {
          setFocus(false);
          setIsTouched(() => true);
        }}
        {...props.config}
      />
      {isTouched &&
        !isValid &&
        props.type !== "login" &&
        props.disableError !== "false" && (
          <Text style={props.styleError ? props.styleError : styles.errorText}>
            {" "}
            {validations[props.name].message(
              props.checkExistOnServer && exist
                ? `Account with ${props.name} already exists`
                : ""
            )}{" "}
          </Text>
        )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 2,
    paddingVertical: 8,
    width: 300,
    maxWidth: "90%",
    fontSize: 18,
    marginTop: 16,
    borderRadius: 5,
  },
  errorText: {
    fontSize: 15,
    color: "red",
  },
});

export default Input;
