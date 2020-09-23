//import React from 'react';
import React, { useEffect } from 'react';
import {StyleSheet, Text, StatusBar} from 'react-native';
import { List, ListItem, Left, Right, View, Body } from 'native-base';

const textDebit = "They'll Pay"
const textCredit = "They'll Recieve"

class ContactList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <React.Fragment>
      <Text>Contacts</Text>
      <List>
        {this.props.data && this.props.data.map((items, i) => {
            return (
              <ListItem key={i}>
                
                <Left>
                  <View>
                  <Text onPress={() => this.props.navigation.navigate('GetUserAmount', { id: items.id })}>{items.name}</Text>
                  </View>
                </Left>
                <Right>
                  <View style={{ flexDirection: 'column' }}>
                    <Body>
                      <Text style={items.amountType === "Pay" ? styles.amountDebit : styles.amountCredit}>
                        {items.amountType === "Pay" || items.amountType === "Receive" ? items.amount : ''}
                      </Text>
                      <Text>
                        {items.amountType === "Pay" ? textDebit : items.amount === null ? <React.Fragment></React.Fragment> : textCredit}
                      </Text>
                    </Body>
                  </View>  
                </Right>
                
              </ListItem>
            );
        })}
      </List>
      </React.Fragment>  
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#ccc',
    padding: 5,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  amountDebit: {
    fontSize: 30,
    color: 'red'
  },
  amountCredit: {
    fontSize: 30,
    color: 'green'
  },
  title: {
    fontSize: 32,
  },
});

export default ContactList