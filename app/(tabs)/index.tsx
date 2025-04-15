import { Image, StyleSheet, Platform, Text, TextInput, View, TouchableOpacity, FlatList, Button } from 'react-native';
import twc from 'twrnc'

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, Entypo } from '@expo/vector-icons';

export default function HomeScreen() {
  const [task, setTask] = useState('');
  const [list, setList] = useState([]);

  const [edit, setEdit] = useState(false);
  const [editID, setEditID] = useState(null);

  const addTask = () => {
    if(task.trim() === '') return;

    const newTask = {
      id: Date.now().toString(),
      title: task.trim(),
    };

    setList([...list, newTask]);
    setTask('');
  }

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(list));
      console.log('Data Added');
    } catch (error) {
      console.log('Error', error)
    }
  };

  const loadTasks = async () => {
    try {
      const saved = await AsyncStorage.getItem('tasks');
      if (saved !== null) {
        setList(JSON.parse(saved));
        console.log('Load Tasks')
      }
    } catch (error) {
      console.log('Error', error)
    }
  }

  const delTask = (id:string) => {
    const filtered = list.filter(item => item.id !== id);
    setList(filtered)
  }

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [list]);


  const handleEdit = () => {
    const updated = list.map(item => item.id === editID ? { ...item, title:task.trim() }:item);
    setList(updated);
    setTask('');
    setEdit(false);
    setEditID(null);
  }

  const startEdit = (item:any) => {
    setTask(item.title);
    setEdit(true);
    setEditID(item.id);
  }

  const [ state, setState ] = useState(false);
  const [ color, setColor ] = useState();
  const toggleState = () => {
      if(state === false){
        setState(true),
        setColor('black')
      } else{
        setState(false),
        setColor('none')
      }
  };



  return (
    <View style={twc`relative h-full bg-gray-100`}>
      <View style={twc`bg-sky-400 w-120 h-30 rounded-b-full absolute -right-8`}/>

      <View style={twc`h-70 w-70 rounded-full absolute bg-sky-500/30 -left-55 top-90`}/>
      <View style={twc`h-70 w-70 rounded-full absolute bg-sky-400/20 -right-60 top-105`}/>

      <TouchableOpacity style={twc`absolute right-7 bottom-7 bg-sky-400 w-12 h-12 justify-center items-center rounded-full z-999912`} onPress={edit ? handleEdit : addTask}>
        <Text style={twc`text-white font-bold text-2xl`}>+</Text>
      </TouchableOpacity>

      <SafeAreaView style={twc``}>
        <View style={twc`px-5 flex-row items-center justify-between`}>
          <AntDesign name='arrowleft' size={20}/>
          <Entypo name='dots-three-vertical' size={20}/>
        </View>

        <View style={twc`flex flex-row items-center justify-between px-5 my-2 mt-18`}>
          <TextInput value={task} onChangeText={setTask} placeholder='Tambahkan Tugas' placeholderTextColor="rgb(71, 71, 71)" style={twc`border border-gray-300 px-4 w-80 bg-white`}/>
          <Button title={edit ? 'Edit' : 'Add'} onPress={edit ? handleEdit : addTask}/>
        </View>

        <View style={twc`flex-row items-center gap-5 mx-3 mt-5 mb-6 left-14`}>
          <Image source={require('@/assets/images/gray-user.png')} style={twc`w-16 h-16`}/>
          <View>
            <Text style={twc`text-gray-700 font-medium`}>Personal</Text>
            <Text style={twc`text-2xl font-medium -mt-1`}>Personal</Text>
          </View>
        </View>

        <FlatList
          data={list}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={twc`mx-5 px-3 py-3 flex-row items-center justify-between bg-white mb-1 shadow`}>
              <View style={twc`flex-row items-center gap-3`}>
                <TouchableOpacity style={twc`bg-${color} border border-gray-700 w-4 h-4 rounded items-center justify-center`} onPress={toggleState}>
                  <Entypo name='check' style={twc`text-white`}/>
                </TouchableOpacity>
                <Text style={twc`text-base`}>{item.title}</Text>
              </View>
              <View style={twc`flex-row items-center gap-2`}>
                <TouchableOpacity onPress={() => startEdit(item)}>
                  <Text style={twc`text-blue-500`}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => delTask(item.id)}>
                  <Text style={twc`text-red-500`}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

