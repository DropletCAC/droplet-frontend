import React, { useState } from "react";
import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ImageBackground } from "react-native";
import Svg, { Ellipse, ClipPath } from "react-native-svg";
import Animated, { useSharedValue, useAnimatedStyle, interpolate, withTiming, withDelay, withSequence, withSpring } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { register, login } from "../../utils/auth.js"
import { useNavigation } from "@react-navigation/native";

import styles from "./styles";

export default function AuthScreen() {
  const { height, width } = Dimensions.get("window");
  const imagePosition = useSharedValue(1);
  const formButtonScale = useSharedValue(1);
  const [isRegistering, setIsRegistering] = useState(false);
  const [emailAddress, setEmailAddress] = useState("tanuj@gmail.com");
  const [name, setName] = useState("");
  const navigation = useNavigation();
  const [password, setPassword] = useState("abc123");

  
  const imageAnimatedStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(
      imagePosition.value,
      [0, 1],
      [-height / 2.8, 0]
    );
    return {
      transform: [
        { translateY: withTiming(interpolation, { duration: 1000 }) },
      ],
    };
  });

  const buttonsAnimatedStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(imagePosition.value, [0, 1], [250, 0]);
    return {
      opacity: withTiming(imagePosition.value, { duration: 500 }),
      transform: [
        { translateY: withTiming(interpolation, { duration: 1000 }) },
      ],
    };
  });

  const closeButtonContainerStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(imagePosition.value, [0, 1], [180, 360]);
    return {
      opacity: withTiming(imagePosition.value === 1 ? 0 : 1, { duration: 800 }),
      transform: [
        { rotate: withTiming(interpolation + "deg", { duration: 1000 }) },
      ],
    };
  });

  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity:
        imagePosition.value === 0
          ? withDelay(400, withTiming(1, { duration: 800 }))
          : withTiming(0, { duration: 300 }),
    };
  });

  const formButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: formButtonScale.value }],
    };
  });

  const loginHandler = () => {
    imagePosition.value = 0;
    if (isRegistering) {
      setIsRegistering(false);
    }
  };

  const registerHandler = () => {
    imagePosition.value = 0;
    if (!isRegistering) {
      setIsRegistering(true);
    }
  };

  const handleButtonPress = () => {
    imagePosition.value = 0;
    if (!isRegistering) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  const handleLogin = () => {
    login(emailAddress, password)
    .then(() => {
      navigation.navigate("Home")
    })
    .catch((error) => {
      alert(error)
    })
  };

  const handleRegister = () => {
    register(emailAddress, password)
    .then(() => {
      navigation.navigate("Home")
    })
    .catch((error) => {
      alert(error)
    })
  };

  return (
    <Animated.View style={styles.container}>
      <ImageBackground source={{uri: "https://bluerockmgt.com/wp-content/uploads/2020/08/bluerock-interior-banner.jpg"}} style={{flex: 1, justifyContent: 'flex-end'}}>
      <Animated.View style={[StyleSheet.absoluteFill, imageAnimatedStyle]}>
        <Svg height={height} width={width}>
          <ClipPath id="clipPathId">
            <Ellipse cx={width / 2} rx={height} ry={height + 100} />
          </ClipPath>
          <View
            style={styles.headerContainer}
          >
            <View
              style={styles.header}
            >
              <Feather
                name="droplet"
                size={60}
                color="black"
                style={{ padding: 5, marginHorizontal: 8 }}
              />
              <View style={{justifyContent: "center"}}>
                <Text style={styles.headerText}>Droplet</Text>
              </View>
            </View>
          </View>
        </Svg>
        
        <Animated.View
          style={[
            styles.closeButtonContainer,
            closeButtonContainerStyle,
          ]}
        >
          <Text
            style={{ color: "white" }}
            onPress={() => (imagePosition.value = 1)}
          >
            X
          </Text>
        </Animated.View>
      </Animated.View>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}       
        behavior= {(Platform.OS === 'ios') ? "position" : null}
        style={styles.bottomContainer}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <Animated.View style={buttonsAnimatedStyle}>
              <TouchableOpacity style={styles.button} onPress={loginHandler}>
                <Text style={styles.buttonText}>LOG IN</Text>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={buttonsAnimatedStyle}>
              <TouchableOpacity style={styles.button} onPress={registerHandler}>
                <Text style={styles.buttonText}>REGISTER</Text>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View
              style={[styles.formInputContainer, formAnimatedStyle]}
            >
              <TextInput
                placeholder="Email"
                placeholderTextColor="black"
                style={styles.textInput}
                onChangeText={(text) => setEmailAddress(text)}
              />
              <TextInput
                secureTextEntry={true}
                placeholder="Password"
                placeholderTextColor="black"
                style={styles.textInput}
                onChangeText={(text) => setPassword(text)}
              />
              <Animated.View
                style={[styles.formButton, formButtonAnimatedStyle]}
              >
                <TouchableOpacity
                  onPress={() => {
                    formButtonScale.value = withSequence(
                      withSpring(1.5),
                      withSpring(1)
                    );
                    handleButtonPress();
                  }}
                >
                  <Text style={styles.buttonText}>
                    {isRegistering ? "REGISTER" : "LOG IN"}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      </ImageBackground>
    </Animated.View>
  );
}