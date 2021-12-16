import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  update,
  child,
} from "firebase/database";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { confirmPasswordReset } from "firebase/auth";

const Home = (props) => {
  const [newToDo, setNewToDo] = useState("");
  const [toDos, setToDos] = useState([]);

  const db = getDatabase();
  const toDoListRef = ref(db, "toDoList/" + props.userId);
  //go to this userId
  const newToDoRef = push(toDoListRef);
  //add new to do to end of toDoListRef

  const onAdd = () => {
    set(newToDoRef, {
      id: newToDoRef.key,
      todo: newToDo,
    }).catch((err) => console.log(err));
    setNewToDo("");
  };
  //newToDoRef.key gives us the key for that specific to do
  //.catch catches any errors

  useEffect(() => {
    onValue(toDoListRef, (snapshot) => {
      if (snapshot.val() !== null) {
        const data = snapshot.val();
        let result = Object.keys(data).map((key) => {
          return { ...data[key], id: key };
        });
        setToDos(result);
      } else {
        setToDos([]);
      }
    });
  }, []);
  //Object.keys gets the data out in a way that it can be rendered
  // if else prevents error from null

  const signout = () => {
    props.userAuth.signOut();
    props.navigation.navigate("Auth");
  };
  //signOut is firebase
  // navigation.navigate("Page") - what page to go to in nav stack

  const TaskItem = ({ item }) => {
    const [toggleEdit, setToggleEdit] = useState(false);
    const [changeToDo, setChangeToDo] = useState("");
    //curly braces when object - item is flat list
    // passing in props item - deconstructed

    const handleEdit = (todo, id) => {
      if (toggleEdit) {
        if (changeToDo !== "") {
          updateData(changeToDo, id);

          setToggleEdit(!toggleEdit);
        }
      } else {
        setChangeToDo(todo);

        setToggleEdit(!toggleEdit);
      }
    };
    //handling toggle of editing. Passing in new todo + id of task we want to target

    const updateData = (toDo, id) => {
      const UpdateToDoRef = ref(db, "toDoList/" + props.userId + "/" + id);

      update(UpdateToDoRef, {
        todo: toDo,
      });
    };
    //updating of data in db. id = specific task id we're ref
    // forward slash to create path when connecting one generated key to another
    // update point to this part and update todo

    return (
      <View style={{ flexDirection: "row" }}>
        {toggleEdit ? (
          <TextInput value={changeToDo} onChangeText={setChangeToDo} />
        ) : (
          <Text>{item.todo}</Text>
        )}
        <Pressable onPress={() => handleEdit(item.todo, item.id)}>
          <Text>{toggleEdit ? "✅" : "🖋️"}</Text>
        </Pressable>
      </View>
    );
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
            renderItem={({ item }) => <TaskItem item={item} />}
            //For each item inside todos put it inside TaskItem as a prop
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
