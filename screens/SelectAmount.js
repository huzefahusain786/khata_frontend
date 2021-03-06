import React from 'react'
import { StyleSheet, Text, View, AsyncStorage } from 'react-native'
import FormButton from '../components/FormButton'

export default class SelectAmount extends React.Component {
  static navigationOptions = {
    title: 'Home Screen',
    headerLeft: null,
    headerBackTitle: null
  };

  signOutAsync = async () => {
    //await AsyncStorage.clear();
    await AsyncStorage.removeItem('userId')
    this.props.navigation.navigate('Auth');
  };
  addAmount = async (type) => {
    const userToken = await AsyncStorage.getItem('userId');
    const getKhataId = await AsyncStorage.getItem('KhataId');
    const body = {
      "userid" : userToken,
      "khataid": getKhataId,
      "contactid":"16",
      "type" : "0", //for initial zero entry
      "amount" : "0",
      "notes":"start with zero"
    }
    console.log (type)
    console.log (body)
    
    /*this.props.navigation.navigate('AddKhata', {  
      typeid: type 
    })*/  
  };
  displayStorage = async () => {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (error, stores) => {
        stores.map((result, i, store) => {
          console.log({ [store[i][0]]: store[i][1] });
          return true;
        });
      });
    });
  }
  render() {
    //this.displayStorage();
    return (
      <View>
        <View style={styles.buttonContainer}>
          <FormButton
            buttonType='outline'
            title='Add Amount'
            buttonColor='#F57C00'
            onPress ={() => this.addAmount('add')}
            buttonStyle = {styles.button}
            style={styles.button}
          />
          <FormButton
            buttonType='outline'
            title='Start With Zero'
            buttonColor='#F57C00'
            onPress ={() => this.addAmount('zero')}
            buttonStyle = {styles.button}
            style={styles.button}
          />

          <FormButton
            buttonType='outline'
            title='Dashboard'
            buttonColor='#F57C00'
            onPress ={() => this.props.navigation.navigate('Dashboard')}
            buttonStyle = {styles.button}
            style={styles.button}
          />

          <FormButton
            buttonType='outline'
            title='Sign Out'
            buttonColor='#F57C00'
            onPress={this.signOutAsync}
            buttonStyle = {styles.button}
            style={styles.button}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    marginTop: 25,
    maxWidth:'100%',
    justifyContent: 'center',
  },
  button: {
    marginBottom: 25,
    width:'50%',
    alignSelf: 'center'
  }
})
