import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  FlatList,
  DeviceEventEmitter,
  ScrollView
} from 'react-native';
import { Card, ListItem } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons';
import ApiUtils from '../system/ApiUtils'
import Spinner from 'react-native-loading-spinner-overlay'
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'react-native-admob'
import SQLiteHelper from '../system/SQLiteHelper'
var db = new SQLiteHelper()

export default class KargoView extends Component<{}> {
  static navigationOptions  = ({ navigation }) => ({
    title: `${navigation.state.params.item.tn}`,
    headerRight: (
      <Icon.Button
        name='md-refresh'
        size={28}
        color="black"
        underlayColor="transparent"
        backgroundColor= "transparent"
        style={{ marginRight: 10 }}
        onPress={() => KargoView.sorgula(navigation)}>
          Yenile
      </Icon.Button>
    )
  });
  constructor(props){
    super(props);
    this.state = {loading:false, params: []};
    db.init()
  }
  render() {
    const { params } = this.props.navigation.state;
    return (
      <View style={{flex: 1, backgroundColor: '#F5FCFF'}}>
        <Spinner visible={this.state.loading} textContent={"Lütfen bekleyin"} textStyle={{color: '#FFFFFF'}} />
        <View style={styles.container}>
          <ScrollView>
            <Card containerStyle={{padding: 0, margin:0, marginTop:10}}>
              <ListItem
                hideChevron
                key={params.item.id}
                title={kargoFirmalari[params.item.firma]}
                subtitle={params.item.tn}
              />
            </Card>
            <Card title='Hareketler' containerStyle={{margin:0, marginTop:10}}>
              <FlatList
                data={JSON.parse(params.item.opts)}
                renderItem={({item}) =>
                  (
                    <ListItem
                      hideChevron
                      key={item.id}
                      title={item.islem}
                      subtitle={<Text style={{paddingTop: 5, paddingLeft:10 }}>{item.tarih + "\n" + item.yer}</Text>}
                    />
                  )
                }
              />
            </Card>
          </ScrollView>
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
  static sorgula(navigation) {
    const { params } = navigation.state;
    fetch(ApiUtils.service('?firma='+params.item.firma+'&tn='+params.item.tn))
    .then(ApiUtils.checkStatus)
    .then((responseJson) => {
      if(responseJson.success){
        navigation.setParams({item: {id: params.item.id, tn: params.item.tn, firma: params.item.firma, opts: JSON.stringify(responseJson.opts)}});
        db.update("kargolar", {
          opts: JSON.stringify(responseJson.opts),
        }, {id: params.item.id})
        DeviceEventEmitter.emit('back', {})
        Alert.alert('Başarılı!', 'Hareketler güncellendi.', [{text: 'Tamam', onPress: () => {}}]);
      }else{
        Alert.alert('Hata!', responseJson.message, [{text: 'Tamam', onPress: () => {}}]);
      }
    })
    .catch((error) => {
      Alert.alert('Hata!', 'Bir şeyler ters gitti. '+error, [{text: 'Tamam', onPress: () => {
        //this.setState({loading: false});
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
});
const kargoFirmalari = {
  mng: 'Mng Kargo',
  yurtici: 'Yurtiçi Kargo',
  ptt: 'PTT Kargo',
  surat: 'Sürat Kargo'
};
