import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Pressable, Button, Alert, Keyboard } from 'react-native';
import { Text, TextInput, DataTable } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const StartScreen = ({navigation, route}) => {

  useEffect(()=>{calculate()});

  const[saving, setSaving] = useState();
  const[afterDiscount, setFinal] = useState();
  const[originalPrice, setPrice] = useState();
  const[totalDiscount, settotalDiscount] = useState();

  const calculate = () => {
    let temp = 0;
    if (originalPrice > 0 && totalDiscount < 100 && totalDiscount > 0) {
      temp = ((100-totalDiscount)/100) * originalPrice;
      setFinal(temp.toFixed(2));
      setSaving((originalPrice-temp).toFixed(2));
    }
    else if (totalDiscount > 100 || totalDiscount < 0 || originalPrice < 0) {
      Alert.alert("Warning","Rules: Number less than 100 & Positive numbers only");
      setPrice(0);
      settotalDiscount(0);
      setFinal(0);
      setSaving(0);
    }
    else {
      //so far all good
    }
  }

  const[history, setHistory] = useState([]);

  const save = () => {
    setHistory([...history,{originalValue: originalPrice, discData: totalDiscount, afterDiscountPrice: afterDiscount}]);
    setPrice(0);
    settotalDiscount(0);
    setFinal(0);
    setSaving(0);
  }

  navigation.setOptions({headerLeft: () => <Button title="History" color="black" onPress={()=> navigation.navigate("History",{HistoryList: history, HistoryFunction: setHistory})} />})

  return (
    <View style={styles.container}>
      <View style={styles.box}>        
        <TextInput style={styles.textInputStyle}
          keyboardType = {"number-pad"}
          onChangeText ={(text) => setPrice(text)}
          value = {originalPrice}
          placeholder = "original price"
        />
        <TextInput style={styles.textInputStyle}
          keyboardType = {"number-pad"}
          onChangeText={(text) => settotalDiscount(text)}
          value = {totalDiscount}
          placeholder = "discount percentage"
        />

      <View style={styles.textBox}>
        <Text style={styles.textStyle}>You save: {saving}</Text>
        <Text style={styles.textStyle}>Final Price: {afterDiscount}</Text>
      </View>

      <LinearGradient
        // Button Linear Gradient
        colors={['blue', '#4169E1', 'blue', 'black']}
        style={styles.button}>
        <Pressable onPress={() => save()} disabled={originalPrice===0 && totalDiscount===0}><Text style={{color: 'white'}}>Save in history</Text></Pressable>
        
        </LinearGradient>
      </View>
    </View>
  );
    
}

const HistoryScreen = ({navigation, route}) => {
  const HistoryList = route.params.HistoryList;
  const HistoryFunction = route.params.HistoryFunction;
  const [historyScreenList, setHisScreenList] = useState(HistoryList);

  const clear = () => {
    Alert.alert("Warning","Continue?",
    [{text:'Confirm',onPress:()=>{
      setHisScreenList([]); 
      navigation.setParams(HistoryFunction([]))}},
    {text:'Cancel',onPress:()=>{}}]
    );
  }

  navigation.setOptions({headerRight: () => <Button title="Clear history" color="black" onPress={()=> clear()}/>})

  const del = (itemIndex) => {
    let tempList = HistoryList.filter((data,index)=>index!==itemIndex);
    navigation.setParams(HistoryFunction(tempList));
    setHisScreenList(tempList);
  }

  return(
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>Original</DataTable.Title>
        <DataTable.Title>-</DataTable.Title>
        <DataTable.Title>Discount</DataTable.Title>
        <DataTable.Title>=</DataTable.Title>
        <DataTable.Title numeric>Final Price</DataTable.Title>
        <DataTable.Title></DataTable.Title>
      </DataTable.Header>
      {historyScreenList.map((item, index)=>{
        return(
      <DataTable.Row>
        <DataTable.Cell>{item.originalValue}</DataTable.Cell>
        <DataTable.Cell>-</DataTable.Cell>
        <DataTable.Cell>{item.discData}%</DataTable.Cell>
        <DataTable.Cell>=</DataTable.Cell>
        <DataTable.Cell>{item.afterDiscountPrice}</DataTable.Cell>
        <DataTable.Cell numeric><Pressable onPress={() => del(index)} style={{backgroundColor:"maroon", width:50, alignItems:"center"}}><Text style={{color: "white"}}>Remove</Text></Pressable></DataTable.Cell>
      </DataTable.Row>
        )
      })}
    </DataTable>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={""} 
        screenOptions={{
          headerStyle: {
            backgroundColor: "#4169E1"
          }
        }}>
        <Stack.Screen name="" component={StartScreen}/>
        <Stack.Screen name="History" component={HistoryScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ecf0f1',
  },
  box: {
    alignItems: 'center',
    marginTop: 10,
  },
  textStyle : {
    fontSize: 18,
    color: '#4169E1', 
    fontFamily: "arial",
    fontWeight: 'bold',
  },
  textInputStyle: {
    width: "85%",
    height: 70,
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textBox: {
    justifyContent: "flex-start",
    width: 300,
    height: 80,
  },
  button: {
    padding: 14,
    alignItems: 'center',
    borderRadius: 10,
    height: 50,
    width: 120,
  }
});

export default App;