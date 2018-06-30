import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  FlatList,
  DeviceEventEmitter
} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import { TextField } from 'react-native-material-textfield';
import { Button, ListItem, Card } from 'react-native-elements'
import Spinner from 'react-native-loading-spinner-overlay'
import ApiUtils from '../system/ApiUtils'
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'react-native-admob'
import SQLiteHelper from '../system/SQLiteHelper'
var db = new SQLiteHelper()

export default class KargoEkle extends Component<{}> {
  static navigationOptions = {
    title: 'Yeni Sorgu',
  };
  constructor(props){
    super(props);
    this.state = {loading:false, hideHareket: true, tn:'', firma:'', opts: []};
    db.init()
  }
  render() {
    let data = [{
      value: 'Mng Kargo',
    }, {
      value: 'Yurtiçi Kargo',
    }, {
      value: 'PTT Kargo',
    }, {
      value: 'Sürat Kargo',
    }];
    let firma_tag = [{
      value: 'mng',
    }, {
      value: 'yurtici',
    }, {
      value: 'ptt',
    }, {
      value: 'surat',
    }];

    return (
      <View style={{flex: 1, backgroundColor: '#F5FCFF'}}>
        <View style={styles.container}>
          <Spinner visible={this.state.loading} textContent={"Lütfen bekleyin"} textStyle={{color: '#FFFFFF'}} />
          <Dropdown
            label='Kargo Firması'
            data={data}
            onChangeText={(value, index, data) => this.setState({
              firma: firma_tag[index].value
            })}
          />
          <TextField
            label='Takip Numarası'
            value={this.state.tn}
            onChangeText={ (tn) => this.setState({ tn: tn }) }
          />
          <Button
            containerViewStyle={{marginLeft: 0, marginRight: 0}}
            onPress={this.sorgula}
            title='SORGULA' />
          <Card containerStyle={[{padding: 0, margin:0, marginTop:10}, this.state.hideHareket && styles.hide]} >
            <FlatList
              data={this.state.opts}
              renderItem={({item}) =>
                (
                  <ListItem
                    hideChevron
                    key={item.id}
                    title={item.islem}
                    subtitle={<Text style={{paddingTop: 5, paddingLeft:10 }}>{item.tarih + "-" + item.yer}</Text>}
                  />
                )
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
  sorgula = () => {
    this.setState({loading: true});
    fetch(ApiUtils.service('?firma='+this.state.firma+'&tn='+this.state.tn))
    .then(ApiUtils.checkStatus)
    .then((responseJson) => {
      if(responseJson.success){
        this.setState({loading: false, hideHareket: false});
        this.setState({opts: responseJson.opts});
        db.insert("kargolar", {
          tn: this.state.tn,
          firma: this.state.firma,
          opts: JSON.stringify(responseJson.opts),
        })
        DeviceEventEmitter.emit('back', {})
      }else{
        Alert.alert('Hata!', responseJson.message, [{text: 'Tamam', onPress: () => {
          this.setState({loading: false});
        }}]);
      }
    })
    .catch((error) => {
      Alert.alert('Hata!', 'Bir şeyler ters gitti. '+error, [{text: 'Tamam', onPress: () => {
        this.setState({loading: false});
      }}]);
    });
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
