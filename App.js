import React, { Component } from 'react';
import {
  StackNavigator,
} from 'react-navigation';
import KargoEkle from './app/screens/KargoEkle';
import KargoIndex from './app/screens/KargoIndex';
import KargoView from './app/screens/KargoView';
import Icon from 'react-native-vector-icons/Ionicons';

export default class App extends Component<{}> {

  render() {
    const AppStack = StackNavigator({
      KargoIndex: {
        screen: KargoIndex,
        navigationOptions: ({navigation}) => ({
            headerRight: (
              <Icon.Button
                name='md-add'
                size={28}
                underlayColor="transparent"
                color="black"
                backgroundColor= "transparent"
                style={{ marginRight: 10 }}
                onPress={() => navigation.navigate('KargoEkle')}>
                  Yeni Sorgu
              </Icon.Button>
            ),
        })
      },
      KargoEkle: { screen: KargoEkle },
      KargoView: { screen: KargoView },
    });
    return(
      <AppStack/>
    );
  }
}
