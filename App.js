import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./firebase";

import Profile from "./Pages/Profile/Profile";
import Auth from "./Pages/Auth/Auth";
import Home from "./Pages/Home/Home";
import Score from "./Pages/Score/Score";

const Stack = createNativeStackNavigator();

export default function App() {
  const [todos, setTodos] = useState([""]);
  const userAuth = getAuth();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    onAuthStateChanged(userAuth, (user) => {
      if (user !== null) setUserId(user.uid);
      else setUserId("");
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Auth">
          {(props) => (
            <Auth userId={userId} userAuth={userAuth} {...props}>
              Auth
            </Auth>
          )}
        </Stack.Screen>
        <Stack.Screen name="Home">
          {(props) => (
            <Home userId={userId} userAuth={userAuth} {...props}>
              Home
            </Home>
          )}
        </Stack.Screen>
        <Stack.Screen name="Profile">
          {(props) => (
            <Profile userId={userId} userAuth={userAuth} {...props}>
              Profile
            </Profile>
          )}
        </Stack.Screen>
        <Stack.Screen name="Score">
          {(props) => (
            <Score userId={userId} userAuth={userAuth} {...props}>
              Score
            </Score>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
