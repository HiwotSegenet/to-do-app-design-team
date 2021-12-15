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
  //
  const newToDoRef = push(toDoListRef);

  const onAdd = () => {
    set(newToDoRef, {
      id: newToDoRef.key,
      todo: newToDo,
    }).catch((err) => console.log(err));
    setNewToDo("");
  };

  //const todokey = push(child(ref(db), "toDos/")).key;
  //console.log("This is the todokey ==> ", todokey);

  useEffect(() => {
    onValue(toDoListRef, (snapshot) => {
      if (snapshot.val() !== null) {
        const data = snapshot.val();
        let result = Object.keys(data).map((key) => {
          return { ...data[key], id: key };
        });

        console.log("result from split ===>", result);
        setToDos(result);
      } else {
        setToDos([]);
      }
    });
  }, []);

  const signout = () => {
    props.userAuth.signOut();
    props.navigation.navigate("Auth");
  };

  const TaskItem = ({ item }) => {
    const [toggleEdit, setToggleEdit] = useState(false);
    const [changeToDo, setChangeToDo] = useState("");

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

    const updateData = (toDo, id) => {
      const UpdateToDoRef = ref(db, "toDoList/" + props.userId + "/" + id);

      update(UpdateToDoRef, {
        todo: toDo,
      });
      //props.navigation.navigate("Add");
    };

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
