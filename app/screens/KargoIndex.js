import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  DeviceEventEmitter,
  Alert
} from 'react-native';
import { Card, ListItem } from 'react-native-elements'
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'react-native-admob'
import SQLiteHelper from '../system/SQLiteHelper'
var db = new SQLiteHelper()

export default class KargoIndex extends Component<{}> {
  static navigationOptions = {
    title: 'Kargolarım',
  };
  constructor(props){
    super(props);
    this.state = {kargolar: [], hideCard: true};
    db.init()
  }
  async componentWillMount() {
   db.createTable("kargolar", [{
     name: 'id',
     dataType: 'integer',
     isNotNull: true,
     options: 'PRIMARY KEY AUTOINCREMENT'
   }, {
     name: 'tn',
     dataType: 'text'
   }, {
     name: 'firma',
     dataType: 'text'
   }, {
     name: 'opts',
     dataType: 'text'
   }])
   this.refresh();
   DeviceEventEmitter.addListener('back', (e)=>{
     this.refresh();
   })
  }
  async refresh() {
    var result = await db.select("kargolar")
    this.setState({
      kargolar: result
    })
    if(Object.keys(result).length){
      this.setState({
        hideCard: false
      })
    }
  }
  render() {
    return(
      <View style={{flex: 1, backgroundColor: '#F5FCFF'}}>
        <View style={styles.container}>
          <Card containerStyle={[{padding: 0, margin:0, marginTop:10}, this.state.hideCard && styles.hide]}>
            <FlatList
              data={this.state.kargolar}
              renderItem={({item}) =>
                <ListItem
                  leftIcon={{name: 'md-close', color: 'red', type: 'ionicon'}}
                  leftIconOnPress={() => {
                    Alert.alert('Onay', 'Bunu silmek istediğinize emin misiniz?',
                    [
                      {
                        text: 'Evet', onPress: () =>
                        {
                          db.delete('kargolar', {id: item.id});
                          this.refresh();
                        }
                      },
                      {
                        text: 'Hayır', onPress: () =>
                        {

                        }
                      }
                    ]);
                  }}
                  key={item.id}
                  title={kargoFirmalari[item.firma]}
                  subtitle={item.tn}
                  onPress = {() => this.props.navigation.navigate('KargoView', {item: item})}
                />
              }
            />
          </Card>
        </View>
        <View style={styles.ads}>
          <AdMobBanner
            adSize="banner"
            adUnitID="ca-app-pub-5173219948212019/6770594276"
            testDevices={[AdMobBanner.simulatorId]}
            onAdFailedToLoad={error => console.error(error)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  ads: {
    alignItems: 'center',
  },
  hide: {
    display: 'none',
  },
});
const kargoFirmalari = {
  mng: 'Mng Kargo',
  yurtici: 'Yurtiçi Kargo',
  ptt: 'PTT Kargo',
  surat: 'Sürat Kargo'
};
