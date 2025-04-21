import { Image, StyleSheet, Platform, Text, TextInput, View, TouchableOpacity, FlatList, Button } from 'react-native';
import twc from 'twrnc'

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, Entypo, FontAwesome5 } from '@expo/vector-icons';

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
        setColor('[#314C1C]')
      } else{
        setState(false),
        setColor('none')
      }
  };



  return (
    <View style={twc`relative h-full bg-gray-100`}>
      <View style={twc`bg-[#032A4E] w-120 h-30 rounded-b-full absolute -right-8`}/>

      <TouchableOpacity style={twc`absolute right-7 bottom-7 bg-sky-400 w-12 h-12 justify-center items-center rounded-full z-999912`} onPress={edit ? handleEdit : addTask}>
        <Text style={twc`text-white font-bold text-2xl`}>+</Text>
      </TouchableOpacity>

      <SafeAreaView style={twc``}>
        <View style={twc`px-5 flex-row items-center justify-between`}>
          <AntDesign name='arrowleft' size={20} style={twc`text-white`}/>
          <Entypo name='dots-three-vertical' size={20} style={twc`text-white`}/>
        </View>

        <View style={twc`flex flex-row items-center justify-between px-5 my-2 mt-18`}>
          <TextInput value={task} onChangeText={setTask} placeholder='Tambahkan Tugas' placeholderTextColor="rgb(71, 71, 71)" style={twc`border border-gray-300 px-4 w-80 bg-white`}/>
          <TouchableOpacity style={twc`bg-[#032A4E] w-10 h-9.5`} onPress={edit ? handleEdit : addTask}>
            <Text style={twc`text-3xl text-white text-center`}>+</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={list}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <View style={twc`px-5 my-1`}>
              <Text style={twc`text-gray-700 font-bold text-base`}>TO DO  </Text>
            </View>
          }
          renderItem={({item}) => (
            <TouchableOpacity style={twc`mx-5 px-4 py-3 flex-row items-center justify-between bg-white mb-1 shadow`} onPress={toggleState}>
              <View style={twc`flex-row items-center gap-3`}>
                <TouchableOpacity style={twc`w-6 h-6 border border-gray-400 bg-${color} rounded items-center justify-center`} onPress={toggleState}>
                  <AntDesign name='check' size={18} style={twc`text-gray-50`}/>
                </TouchableOpacity>
                <Text style={twc`text-base`}>{item.title}</Text>
              </View>
              <View style={twc`flex-row items-center gap-2`}>
              <TouchableOpacity onPress={() => startEdit(item)} style={twc`bg-[#032A4E] w-10 h-10 items-center justify-center rounded-lg`}>
                <FontAwesome5 name='pen' style={twc`text-white`} size={18}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => delTask(item.id)} style={twc`bg-[#8B1A10] w-10 h-10 items-center justify-center rounded-lg`}>
                <FontAwesome5 name='trash-alt' style={twc`text-white`} size={18}/>
              </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

