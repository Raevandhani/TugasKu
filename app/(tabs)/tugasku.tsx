import { Image, StyleSheet, Platform, Text, TextInput, View, TouchableOpacity, FlatList, Button, ScrollView, Alert} from 'react-native';
import twc from 'twrnc'

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, Entypo } from '@expo/vector-icons';

export default function TabTwoScreen() {
  const [task, setTask] = useState('');
  const [subject, setSubject] = useState('');
  const [deadline, setDeadline] = useState('');


  const [list, setList] = useState([]);

  const [edit, setEdit] = useState(false);
  const [editID, setEditID] = useState(null);

  const addAssignment = () => {
    if( task.trim() === '' || subject.trim() === '' || deadline.trim() === '') return;

    const newAssignment = {
      id: Date.now().toString(),
      title: task.trim(),
      subject: subject.trim(),
      deadline: deadline.trim(),
    };

    setList([...list, newAssignment]);

    setTask('');
    setSubject('');
    setDeadline('');
  }

  const saveAssignments = async () => {
    try {
      await AsyncStorage.setItem('assignment', JSON.stringify(list));
      console.log('Assignment Saved');

    } catch (error) {
      console.log('Error', error)
    }
  };

  const loadAssignments = async () => {
    try {
      const saved = await AsyncStorage.getItem('assignment');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        setList(parsed);
      }
    } catch (error) {
      console.log('Load Error', error);
    }
  };

  const delTask = (id:string) => {
    const filtered = list.filter(item => item.id !== id);
    
    Alert.alert(
      "Are You Sure?",
      "Task that is deleted CANNOT be restored",
      [
        {
          text: "Cancel"
        },
        {
          text: "Delete",
          onPress: () => setList(filtered), // Clear the list when OK is pressed
        },
      ]
    );
  }

  const deleteall = () => {
    Alert.alert(
      "Are You Sure?",
      "All task that is deleted CANNOT be restored",
      [
        {
          text: "Cancel"
        },
        {
          text: "Delete All",
          onPress: () => setList([]), // Clear the list when OK is pressed
        },
      ]
    );
  }

  useEffect(() => {
    loadAssignments();
  }, []);

  useEffect(() => {
    saveAssignments();
  }, [list]);


  const handleEdit = () => {
    let ts = task.trim();
    let pmo = subject.trim();
    let sybau = deadline.trim();

    const edited = list.find(item => item.id === editID);

    const tsChanged = ts !== edited?.title;
    const pmoChanged = pmo !== edited?.subject;
    const syabuChanged = sybau !== edited?.deadline;

    // const updated = list.map(item => item.id === editID ? { ...item, title:task.trim(),subject:subject.trim(),deadline:deadline.trim() }:item);
    if (tsChanged || pmoChanged || syabuChanged) {
      const updated = list.map(item => 
        item.id === editID 
          ? { ...item, title: ts, subject: pmo, deadline: sybau } 
          : item
      );
      
      setList(updated);
  
      Alert.alert(
        "Task Updated",
        "Your task has been successfully updated",
        [{ text: "OK" }]
      );
    } else {
      console.log('No changes detected');
    }
    
    setTask('');
    setSubject('');
    setDeadline('');

    setEdit(false);
    setEditID(null);
  }

  const startEdit = (item:any) => {
    setTask(item.title);
    setSubject(item.subject);
    setDeadline(item.deadline);

    setEdit(true);
    setEditID(item.id);
  }

  return (
    <View style={twc`relative`}>
      <View style={twc`h-70 w-70 rounded-full absolute bg-black/2 -right-20 -top-40`}/>
      <View style={twc`h-70 w-70 rounded-full absolute bg-black/3 -right-35 -top-10`}/>

      <View style={twc`h-70 w-70 rounded-full absolute bg-sky-500/30 -left-40 top-90`}/>
      <View style={twc`h-70 w-70 rounded-full absolute bg-sky-400/20 -left-45 top-105`}/>

      <SafeAreaView>
        <ScrollView style={twc``} scrollEnabled>
          <Text style={twc`text-center my-4 text-2xl font-bold text-sky-500`}>Studify</Text>
          <View style={twc`gap-3.5 mx-5 border border-gray-400 px-5.5 py-8 bg-white/30`}>
            <Text style={twc`text-xl font-medium`}>📚 {edit ? 'Edit' : 'Create'} Assignment</Text>

            <View style={twc`items-center w-full gap-2`}>
              <TextInput value={task} onChangeText={setTask} placeholder='Judul Tugas' placeholderTextColor="rgb(110, 110, 110)" style={twc`border border-gray-300 px-4 w-full bg-gray-200/20`}/>
              <TextInput value={subject} onChangeText={setSubject} placeholder='Mata Pelajaran' placeholderTextColor="rgb(110, 110, 110)" style={twc`border border-gray-300 px-4 w-full bg-gray-200/20`}/>
              <TextInput value={deadline} onChangeText={setDeadline} placeholder='Deadline ( e.g. 11 Agustus 2008 )' placeholderTextColor="rgb(110, 110, 110)" style={twc`border border-gray-300 px-4 w-full bg-gray-200/20`}/>
            </View>

            <TouchableOpacity onPress={edit ? handleEdit : addAssignment} style={twc`bg-${edit ? 'green-400' : 'sky-400'} py-2`}>
              <Text style={twc`text-center text-base text-base font-bold text-white`}>{edit ? 'Update' : 'Add Assignment'}</Text>
            </TouchableOpacity>
          </View>

          <View style={twc`mx-5 gap-4 my-3 px-5.5 py-8 bg-gray-50/90 rounded-xl border border-black/30 relative`}>
            <View style={twc`bg-red-500 h-3.5 w-3.5 absolute rounded-full top-2 left-2`}/>
            <View style={twc`flex-row items-center justify-between`}>
              <Text style={twc`text-xl font-medium`}>📌 My Assignmemt</Text>
              <TouchableOpacity style={twc`bg-red-800 px-3 py-1 rounded`} onPress={deleteall}>
                <Text style={twc`text-white`}>Delete All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={list}
              numColumns={2}
              keyExtractor={item => item.id}
              scrollEnabled
              renderItem={({item}) => (
                <View style={twc`px-3 py-3 items- justify-between bg-white mb-1 w-[47.5%] mr-4 mb-3 gap-5 rounded shadow-md border border-gray-800/10`}>
                  <View style={twc`gap-0.5`}>
                    <Text style={twc`text-base mb-0.5`}>{item.title}</Text>
                    <Text style={twc`text-gray-500`}>📗 {item.subject}</Text>
                    <Text style={twc`text-gray-500 text-xs`}>🕒 {item.deadline}</Text>
                  </View>
                  <View style={twc`flex-row items-center justify-between gap-2`}>
                    <TouchableOpacity onPress={() => startEdit(item)} style={twc`w-[48%] bg-blue-500 py-1 rounded-lg`}>
                      <Text style={twc`text-white text-center font-bold`}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => delTask(item.id)} style={twc`w-[48%] bg-red-500 py-1 rounded-lg`}>
                      <Text style={twc`text-white text-center font-bold`}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}