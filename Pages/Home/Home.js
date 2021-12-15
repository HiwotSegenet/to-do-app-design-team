import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  update,
} from "firebase/database";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const Home = (props) => {
  const [newToDo, setNewToDo] = useState("");
  const [toDos, setToDos] = useState({ id: "", todo: "" });

  const db = getDatabase();
  const toDoListRef = ref(db, "toDoList/" + props.userId);
  // const UpdateToDoRef = ref(db, "toDos/" + );
  const newToDoRef = push(toDoListRef);

  const onAdd = () => {
    set(newToDoRef, {
      todo: newToDo,
    }).catch((err) => console.log(err));
    setNewToDo("");
  };

  const updateData = () => {
    update(UpdateToDoRef, {
      text: toDo,
    });
    props.navigation.navigate("Add");
  };

  useEffect(() => {
    onValue(toDoListRef, (snapshot) => {
      const data = snapshot.val();
      let result = Object.keys(data).map((key) => {
        return { ...data[key], id: key };
      });

      console.log("result from split ===>", result);
      setToDos(result);
    });
  }, []);

  const signout = () => {
    props.userAuth.signOut();
    props.navigation.navigate("Auth");
  };
  return (
    <View>
      <TouchableOpacity onPress={() => props.navigation.navigate("Profile")}>
        <Ionicons name="person-circle-outline" size={24} color="black" />
      </TouchableOpacity>
      <Text>Things To Do!</Text>
      <View>
        <TouchableOpacity onPress={() => onAdd()}>
          <AntDesign name="plus" size={15} color="#000" />
        </TouchableOpacity>

        <TextInput
          placeholder="Add to do item"
          value={newToDo}
          onChangeText={setNewToDo}
        />
      </View>

      <View>
        <View>
          <FlatList
            data={toDos}
            renderItem={({ item, index }) => (
              <Text key={index}>
                {item.todo} {item.id}
              </Text>
            )}
          />
        </View>
      </View>
      <TouchableOpacity onPress={signout}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.navigation.navigate("Score")}>
        <Text>Score Page</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
