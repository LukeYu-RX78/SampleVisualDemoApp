import { Image, StyleSheet, Platform, Text, FlatList, View, TextInput, Button } from 'react-native';
import React, {useEffect, useState} from 'react';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import dummyData from '@/constants/dummyData.json';

export default function HomeScreen() {

  const [data, setData] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://samplevisualdemocorewebapi-fwf5ezc9akacfhg5.eastus-01.azurewebsites.net/api/SampleVisual/GetStagingSamples', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        setData(json);
      } catch (error) {
        setData([]);
      }
    };

    fetchData();
  }, []);

  
  const handleButtonClick = () => {
    fetch('https://samplevisualdemocorewebapi-fwf5ezc9akacfhg5.eastus-01.azurewebsites.net/api/SampleVisual/ExecuteSql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: inputValue,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.Message) {
          console.log(data.Message);
        } else {
          console.log(data);
          setData(data); 
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };


  const renderItem = ({ item }: { item: any }) => (
    <View  style = {styles.row}>
      <Text style = {styles.cell}>{item.SampleID}</Text> 
      <Text style = {styles.cell}>{item.HoleID}</Text> 
      <Text style = {styles.cell}>{item.mTo}</Text> 
      <Text style = {styles.cell}>{item.mFrom}</Text>
      <Text>Edit</Text>
    </View>
  );

  const keyExtractor = (item: any) => item.SampleID;

  return (
    <View style = {styles.container}>
      <View style = {styles.headerTopBar}>
        <Text style = {styles.headerTopBarText}>StagingRCSamples</Text>
      </View>
      <View style = {styles.header}>
        <Text style = {styles.heading}>SampleID</Text>
        <Text style = {styles.heading}>HoleID</Text>
        <Text style = {styles.heading}>mFrom</Text>
        <Text style = {styles.heading}>mTo</Text>
        <Text style = {styles.heading}>Action</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem} />
      <TextInput
        placeholder="Enter SQL query."
        value = {inputValue}
        onChangeText={setInputValue}
        style = {styles.InputBox}
      />
      <Button title="Execute" onPress={handleButtonClick} />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  container: {
    flex: 1,
    backgroundColor: '#D6E7BB',
    paddingVertical: 30,
    paddingHorizontal: 30,
  },
  headerTopBar: {
    backgroundColor: '#4F4F4F',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 5,
    elevation: 2,
  },
  headerTopBarText: {
    color: '#FFF',
    fontSize: 16,
  },
  header: {
    backgroundColor: "#80C342",
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  heading: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    marginHorizontal: 2,
    elevation: 1,
    borderRadius: 3,
    borderColor: '#FFF',
    padding: 10,
    backgroundColor: '#FFF',
  },
  cell: {
    fontSize: 14,
    textAlign: 'left',
    flex: 1,
  },
  InputBox: {
    height: 40,
    borderColor: '#4F4F4F',
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: '#FFF',
  }
});
