import { Image, StyleSheet, Platform, Text, TextInput, View, TouchableOpacity, FlatList, Button, ScrollView, Alert, ToastAndroid} from 'react-native';
import twc from 'twrnc'

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, Entypo, FontAwesome5 } from '@expo/vector-icons';

export default function TabTwoScreen() {
  const [task, setTask] = useState('');
  const [subject, setSubject] = useState('');
  const [deadline, setDeadline] = useState('');

  const [list, setList] = useState([]);

  const [edit, setEdit] = useState(false);
  const [editID, setEditID] = useState(null);

  const addAssignment = () => {
    if( task.trim() === '' || subject.trim() === '' || deadline.trim() === '') {
      Alert.alert('Error 404', 'Input cannot be null', [{ text: 'Try Again' }])
      return;
    }

    if( subject.trim().length < 3 ) {
      Alert.alert('Subject is less than 3 characters', 'Min 3 Characters', [{ text: 'Try Again' }])
      return;
    }
      
    const newAssignment = {
      id: Date.now().toString(),
      title: task.trim(),
      subject: subject.trim(),
      deadline: deadline.trim(),
    };

    setList([...list, newAssignment]);
    ToastAndroid.show('Assignments Added', ToastAndroid.SHORT)
  
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
          onPress: () => {
            setList(filtered);
            ToastAndroid.show('Deleted Assignments', ToastAndroid.SHORT)
          }
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
          onPress: () => {
            setList([]);
            ToastAndroid.show('Deleted All Assignments', ToastAndroid.SHORT)
          }
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
    const sybauChanged = sybau !== edited?.deadline;

    // const updated = list.map(item => item.id === editID ? { ...item, title:task.trim(),subject:subject.trim(),deadline:deadline.trim() }:item);

    if (tsChanged || pmoChanged || sybauChanged) {
      const updated = list.map(item => 
        item.id === editID 
          ? { ...item, title: ts, subject: pmo, deadline: sybau } 
          : item
      );
      
      Alert.alert(
        "Are You Sure?",
        'Changes CAN BE change in the future',
        [
          {
            text: "Cancel"
          },
          {
            text: "Confirm",
            onPress: () => {
            setList(updated);
            ToastAndroid.show('Assignment Updated', ToastAndroid.SHORT)
          }
          },
        ]
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
    <View style={twc`relative h-full`}>
      <View style={twc`h-70 w-70 rounded-full absolute bg-black/2 -right-20 -top-40`}/>
      <View style={twc`h-70 w-70 rounded-full absolute bg-black/3 -right-35 -top-10`}/>

      <View style={twc`h-70 w-70 rounded-full absolute bg-[#032A4E]/25 -left-55 top-90`}/>
      <View style={twc`h-70 w-70 rounded-full absolute bg-[#032A4E]/15 -left-60 top-105`}/>

      <SafeAreaView>

          

          <View style={twc`px-5 mt-4`}>
            
            <FlatList
              data={list}
              keyExtractor={item => item.id}
              scrollEnabled
              nestedScrollEnabled={true}
              ListHeaderComponent={  
                <View style={twc`mb-2`}>
                  <Text style={twc`my-2 text-2xl font-bold text-[#032A4E] text-center`}>TugasKu</Text>
                  <View style={twc`gap-3`}>
                    <View style={twc`w-full gap-2`}>
                      <TextInput value={task} onChangeText={setTask} placeholder='Judul Tugas' placeholderTextColor="rgb(110, 110, 110)" style={twc`border border-[#d5d5d5] px-4 w-full bg-gray-100 rounded-md`}/>
                      <TextInput value={subject} onChangeText={setSubject} placeholder='Mata Pelajaran' placeholderTextColor="rgb(110, 110, 110)" style={twc`border border-[#d5d5d5] px-4 w-full bg-gray-100 rounded-md`}/>
                      <View style={twc`flex-row items-center justify-between`}>
                        <TextInput value={deadline} onChangeText={setDeadline} placeholder='Deadline ( e.g. 11 Agustus 2008 )' placeholderTextColor="rgb(110, 110, 110)" style={twc`border border-[#d5d5d5] px-4 w-80% bg-gray-100 rounded-md`}/>
                        <View style={twc`w-18% h-10 items-center justify-center rounded-md bg-[#032a4e]`}>
                          <AntDesign name="calendar" size={25} style={twc`text-white`}/>
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity onPress={edit ? handleEdit : addAssignment} style={twc`bg-${edit ? '[#314C1C]' : '[#032A4E]'} py-2 rounded-md`}>
                      <Text style={twc`text-center text-base text-base font-bold text-white`}>{edit ? 'Update Tugas' : 'Tambah Tugas'}</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={twc`flex-row justify-between items-center mt-5`}>
                    <Text style={twc`text-base text-gray-700 font-bold`}>TUGAS ANDA</Text>

                    <TouchableOpacity style={twc`bg-red-800 px-3 py-1 rounded`} onPress={deleteall}>
                      <Text style={twc`text-white`}>Delete All</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              }
              renderItem={({item}) => (
                <TouchableOpacity style={twc`px-5 py-6 flex-row items-center justify-between bg-white gap-5 rounded bg-gray-50 border border-gray-800/10 rounded-lg mb-2`} onPress={toggleState}>
                  <View style={twc`flex-row items-center gap-5`}>
                    <TouchableOpacity style={twc`w-10 h-10 border border-gray-400 bg-${color} rounded-lg items-center justify-center`} onPress={toggleState}>
                      <AntDesign name='check' size={24} style={twc`text-gray-50`}/>
                    </TouchableOpacity>
                    <View style={twc`gap-0.1`}>
                      <Text style={twc`text-base text-gray-800 font-medium`}>{item.title}</Text>
                      <Text style={twc`text-gray-500`}>Mapel {item.subject}</Text>
                      <Text style={twc`text-[#8B1A10] text-base font-bold `}>{item.deadline}</Text>
                    </View>
                  </View>
                  <View style={twc`flex-row items-center justify-between gap-2`}>
                    <TouchableOpacity onPress={() => startEdit(item)} style={twc`bg-[#032A4E] w-10 h-10 items-center justify-center rounded-lg`}>
                      <FontAwesome5 name='pen' style={twc`text-white`} size={18}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => delTask(item.id)} style={twc`bg-[#8B1A10] w-10 h-10 items-center justify-center rounded-lg`}>
                      <FontAwesome5 name='trash-alt' style={twc`text-white`} size={18}/>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
              ListFooterComponent={ list.length > 0 && (
                <View></View>
              )}
              ListEmptyComponent={
                <View style={twc`my-5`}>
                  <Text style={twc`text-gray-500 text-base font-medium text-center`}>TIDAK ADA TUGAS</Text>
                </View>
              }
            />
          </View>
      </SafeAreaView>
    </View>
  );
}