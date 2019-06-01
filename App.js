/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, View, Image, Button, TouchableOpacity, AppRegistry, FlatList, AsyncStorage, Picker } from 'react-native';
// import Images from './img/index'

class PopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      UserID: 0
    };
  }
  _ChangeUser = this.props._ChangeUser.bind(this);

  render() {
    if (this.props.mode == 1) {
      return (
        <View style={{ backgroundColor: "white" }}>
          <Picker
            style={[styles.picker]} itemStyle={styles.pickerItem}
            selectedValue={this.state.UserID}
            onValueChange={
              itemValue => { this.props._ChangeUser(itemValue); this.setState({ UserID: itemValue }); }
            }
          >
            <Picker.Item label="koya" value={0} />
            <Picker.Item label="tsushi" value={1} />
            <Picker.Item label="haruka" value={2} />
            <Picker.Item label="mitsuhasi" value={3} />
            <Picker.Item label="gaku" value={4} />
          </Picker>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Button
              title="select"
              onPress={
                this.props._ChangeUser(this.state.UserID)
              }
              onPress={() => {
                this.props._ChangeUser(this.state.UserID)()
                this.props._ModeChange()()
              }

              }>

            </Button>
          </View>
        </View>
      );
    }
    else {
      return (null);
    }
  }
}

class Currentuser extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

  }
  // this.prop.UIDとDBを使っていきたい
  render() {
    return (
      <View style={styles.CurrentUser}>
        <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 20 }}>あなた</Text>
          <TouchableOpacity
            onPress={this.props._ModeChangeC()}>
            <Image
              style={{ width: 40, height: 40 }}
              source={this.props.info[this.props.CurrentUser].img}
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 20 }}>{this.props.info[this.props.CurrentUser].name}</Text>
        </View>
        <View style={{ flex: 5, justifyContent: "space-evenly", alignItems: "center" }}>
          {/* 拍手できる，された数をDBから持ってきたい */}
          <Text style={{ fontSize: 20 }} >拍手できる: {this.props.info[this.props.CurrentUser].p1}</Text>
          <Text style={{ fontSize: 20 }} >拍手された: {this.props.info[this.props.CurrentUser].p2}</Text>
        </View>
      </View>
    );
  }
}
class PostInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentUser: this.props.CurrentUser,
      TargetUser: this.props.TargetUser,
      text: '',
      text_l: 0
    };
  }

  render() {
    return (
      <View style={styles.TargetUser}>
        {/* 対象 */}
        <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 20 }}>相手</Text>
          <TouchableOpacity
            onPress={this.props._ModeChangeT()}>
            <Image
              style={{ width: 40, height: 40 }}

              source={this.props.info[this.props.TargetUser].img}
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 20 }}>{this.props.info[this.props.TargetUser].name}</Text>
        </View>
        {/* 内容 */}
        <View style={{ flex: 6, justifyContent: "space-evenly", alignItems: "center", paddingVertical: 5 }}>
          <TextInput
            style={{ width: 220, flex: 1, borderWidth: 1, borderColor: "black", backgroundColor: '#FFF' }}
            placeholder="Type here to translate!"
            onChangeText={(t) => this.setState({ text: t, text_l: t.length })}
            multiline={true}
          />
        </View>
        {/* 投稿ボタン */}
        <View style={{ flex: 2, justifyContent: "space-evenly", alignItems: "center" }}>
          <Button
            title="投稿"
            color="#841584"
            disabled={(this.state.text_l <= 4 ? true : false)}
            onPress={this.props._onPressPost(this.props.CurrentUser, this.props.TargetUser, this.state.text)}
          />
        </View>
      </View>
    );
  }
}

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Hakusyu_total: 0,
      item: this.props.item,
      Hakusyu_log: {
        1: 0,
        2: 4,
      }
    };
  }
  HakusyuInc = () => { this.setState({ Hakusyu_total: this.state.Hakusyu_total + 1 }) };
  render() {
    return (
      // this.props.PostIDで「DBから誰から誰に」「メッセージ」「時間」「拍手数」をもってきたい
      <View style={{ flex: 1, flexDirectionL: "colmun", borderWidth: 0.2, borderColor: "black", margin: 5, backgroundColor: "#FDF5E6", borderRadius: 5 }}>

        {/* 誰から誰に */}
        <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-start", padding: 10 }}>
          <Image source={this.props.info[this.state.item.from].img} style={{ width: 30, height: 30 }} />
          <Text> ➡︎ </Text>
          <Image source={this.props.info[this.state.item.to].img} style={{ width: 30, height: 30 }} />
          {/* <Text>{this.props.info[this.state.item.from].name} to {this.props.info[this.state.item.to].name} sighting {this.props.CurrentUser}</Text> */}
        </View>

        {/* 内容 */}
        <View style={{ flex: 40, justifyContent: "center", alignItems: "center" }}>
          <Text>{this.state.item.text}</Text>
        </View>

        {/* 拍手と時間 */}
        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" , paddingRight:10}}>
          <View style={{ flexDirection: 'row', justifyContent: "center", alignItems: "center" }}>
            <Button
              onPress={() => {
                this.props._onPressHakusyu(this.props.CurrentUser, this.props.item.from, this.props.item.to)()
                this.HakusyuInc()

              }
              }
              // onPress= {this._}
              title="👏"
              color="black"
              disabled={(this.props.CurrentUser != this.state.item.from && this.props.CurrentUser != this.state.item.to
                        && this.props.info[this.props.CurrentUser].p1>0) ? false : true}
            />
            <Text>{this.state.Hakusyu_total}</Text>
          </View>
          <Text>{this.state.item.date}</Text>
        </View>
      </View>
    );
  }
}



export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentUser: 0,
      TargetUser: 0,
      SelectCurrentUserMode: -1,
      SelectTargetUserMode: -1,
      // asyncstrageに保存されたJSONデータからオブジェクトにデコードして[{},{},{}]の形で持っておきたい
      Users: {
        0: {
          name: 'koya',
          img: require('./img/users/user0.png'),
          p1: 100,
          p2: 0
        },
        1: {
          name: 'tsushi',
          img: require('./img/users/user1.png'),
          p1: 100,
          p2: 0
        },
        2: {
          name: 'haruka',
          img: require('./img/users/user2.png'),
          p1: 100,
          p2: 0
        },
        3: {
          name: 'mitsu',
          img: require('./img/users/user3.png'),
          p1: 100,
          p2: 0
        },
        4: {
          name: 'gaku',
          img: require('./img/users/user4.png'),
          p1: 100,
          p2: 0
        }
      },
      posts: [
        {
          key: '1',
          date:'2019/6/1 13:13',
          from: 0,
          to: 2,
          text: "すごかったね",
          Hakusyu_log: {
            0: 0,
            1: 0,
            2: 0,
            3: 0
          }
        },
        {
          key: '2',
          date:'2019/6/1 10:13',
          from: 1,
          to: 3,
          text: "すごいすごい",
          Hakusyu_log: {
            0: 0,
            1: 0,
            2: 0,
            3: 0
          }
        },

      ],
      listUpdate: 0,
    };

    this._ChangeCurrentUser = this._ChangeCurrentUser.bind(this);
    this._ChangeTargetUser = this._ChangeTargetUser.bind(this);
  }

  // 投稿ボタンを押した時の状態の変化
  _onPressPost = (_from, _to, _text) => () => {
    var dt = new Date()
    const list = [{
      key: Date.now().toString(),
      date: dt.getFullYear().toString() + '/' + (dt.getMonth() + 1).toString() + '/' + dt.getDate().toString() + '/ ' + dt.getHours().toString() + ':' + dt.getMinutes().toString() + ':' + dt.getSeconds().toString(),
      from: _from,
      to: _to,
      text: _text,
    }].concat(this.state.posts);
    this.setState({
      posts: list,
      listUpdate: this.state.listUpdate + 1
    });
  }
  // 現在のユーザを変更する時の状態の変化
  _ChangeCurrentUser = (to) => () => {
    this.setState({
      CurrentUser: to,
      listUpdate: this.state.listUpdate + 1
    })
  }
  // 拍手相手ユーザを変更する時の状態の変化
  _ChangeTargetUser = (to) => () => {
    this.setState({
      TargetUser: to,
    })

  }
  // 拍手ボタンを押した時の状態の変化
  _Hakusyu = (CurrentUser, _from, _to) => {
    // const Users = Object.assign({}, this.state.Users, { CurrentUser : Object.assign({}, this.state.Users[CurrentUser], {p1: this.state.Users[CurrentUser].pi+1 })      });
    // const Users_test = this.state.Users;
    // Users_test[CurrentUser].pi += 1;
    // this.setState({ Users: Users_test });
    // this.setState({ CurrentUser: 4 });
  }
  _onPressHakusyu = (CurrentUser, _from, _to) => () => {
    // 
    Users_tmp = this.state.Users;
    Users_tmp[CurrentUser].p1 -= 2
    Users_tmp[_from].p2 += 1
    Users_tmp[_to].p2 += 1
    
    this.setState({ Users: Users_tmp });
  }
  _ModeChangeC = () => () => {
    this.setState({ SelectCurrentUserMode: this.state.SelectCurrentUserMode * (-1) })
  }
  _ModeChangeT = () => () => {
    this.setState({ SelectTargetUserMode: this.state.SelectTargetUserMode * (-1) })
  }
  // async strageを利用するメソッド
  _storeData = async (text) => {
    try {
      await AsyncStorage.setItem('@MySuperStore:key', { text }.toString + 'I like to save it.');
    } catch (error) {
      // Error saving data
    }
  };

  render() {
    // AsyncStorage.setItem('UID1',JSON.stringify(UID123_object))
    return (
      <View style={styles.container} >
        {/* <Text>Current User {this.state.CurrentUser}  |  TargetUser: {this.state.TargetUser} | execData: {this.state.listUpdate} </Text> */}
        <Currentuser info={this.state.Users} CurrentUser={this.state.CurrentUser} _ModeChangeC={this._ModeChangeC} />
        <PopUp _ChangeUser={this._ChangeCurrentUser} mode={this.state.SelectCurrentUserMode} _ModeChange={this._ModeChangeC} />
        <PostInput info={this.state.Users} CurrentUser={this.state.CurrentUser} TargetUser={this.state.TargetUser} _onPressPost={this._onPressPost} _ModeChangeT={this._ModeChangeT} _ChangeTargetUser={this._ChangeTargetUser}></PostInput>
        <PopUp _ChangeUser={this._ChangeTargetUser} mode={this.state.SelectTargetUserMode} _ModeChange={this._ModeChangeT} />
        {/* 過去の拍手の履歴をリスト形式で表示 */}
        <View style={styles.LogList} >
          <FlatList
            data={this.state.posts}
            execData={this.state.listUpdate}
            renderItem={({ item }) =>
              (<Post info={this.state.Users} item={item} CurrentUser={this.state.CurrentUser} _onPressHakusyu={this._onPressHakusyu} />)}
          />
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 34,

  },
  CurrentUser: {
    // flex: 5,
    flexDirection: "row",
    paddingVertical: 3,
    margin: 5 ,
    backgroundColor: '#E0FFFF',
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: "black"
  },
  TargetUser: {
    // flex: 6,
    flexDirection: "row",
    paddingVertical: 3,
    margin: 5 ,
    backgroundColor: '#F0F8FF',
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: "black"
  },
  LogList: {
    flex: 1,
    backgroundColor: 'white',
  },
  PopUp: {
    justifyContent: "center"
  },

});

