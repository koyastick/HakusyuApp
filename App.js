import React, { Component } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, View, Image, Button, TouchableOpacity,TouchableHighlight, AppRegistry, FlatList, AsyncStorage, Picker } from 'react-native';
// import PopUp from 'myApp/src/components/PopUp'


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentUser: "UID0",
      TargetUser: "UID1",
      SelectCurrentUserMode: -1,
      SelectTargetUserMode: -1,
      Users: require('./src/UserInfo.json'),
      Posts: [
      ],
      listUpdate: 0,
    };
    this.check();
    this._ChangeCurrentUser = this._ChangeCurrentUser.bind(this);
    this._ChangeTargetUser = this._ChangeTargetUser.bind(this);
  }
  // 起動済かどうかの確認
  check = async () => {
    try {
      const value = await AsyncStorage.getItem("re");
      if (value == null) {
        // 初回起動時:JSONファイルから持ってくる
        console.log(value);
        this._storeData("re", "hoge")
        this.setState({ Users: require('./src/UserInfo.json') })
        this.setState({ Posts: [] })
        this._storeData("Users", JSON.stringify(this.state.Users))
        this._storeData("Posts", JSON.stringify(this.state.Posts))
      }
      else {
        // 次回起動時:ストレージから持ってくる
        this.setState({ popo: value })
        this._loadUsers()
        this._loadPosts()
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  // リストのレンダリング行いたいときに使う関数
  _listUpdate = () => {
    this.setState({
      listUpdate: this.state.listUpdate + 1
    })
  }
  // 投稿ボタンを押した時の状態の処理
  _onPressPost = (_from, _to, _text) => () => {
    var dt = new Date()
    list = [{
      key: Date.now().toString(),
      date: dt.getFullYear().toString() + '/' + (dt.getMonth() + 1).toString() + '/' + dt.getDate().toString() + '/ ' + dt.getHours().toString() + ':' + dt.getMinutes().toString() + ':' + dt.getSeconds().toString(),
      from: _from,
      to: _to,
      total_h: 0,
      text: _text,
      Hakusyu_log: {
        "UID0": 0,
        "UID1": 0,
        "UID2": 0,
        "UID3": 0,
        "UID4": 0
      }
    }]
    list = list.concat(this.state.Posts);

    list.sort(function (a, b) {
      if (a.key > b.key) return -1;
    });
    this._storeData("Posts", JSON.stringify(list))
    this.setState({
      Posts: list,
      listUpdate: this.state.listUpdate + 1
    })
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
  _onPressHakusyu = (CurrentUser, _from, _to, _total_h, PostKey) => () => {
    // ユーザ情報の更新
    Users_tmp = this.state.Users;
    Users_tmp[CurrentUser].h1 -= 2;
    Users_tmp[_from].h2 += 1;
    Users_tmp[_to].h2 += 1;
    // 投稿情報の更新
    A = this.state.Posts.filter(function (item, k) { if (item.key == PostKey) return true; });
    A[0].total_h = _total_h + 1;
    A[0].Hakusyu_log[CurrentUser] += 1;
    B = this.state.Posts.filter(function (item, k) { if (item.key != PostKey) return true; });
    Posts_tmp = B.concat(A);
    Posts_tmp.sort(function (a, b) {
      if (a.key > b.key) return -1;
    });
    this._storeData("Users", JSON.stringify(Users_tmp));
    this._storeData("Posts", JSON.stringify(Posts_tmp));
    this.setState({
      Users: Users_tmp,
      Posts: Posts_tmp
    });
  }
  _ModeChangeC = () => () => {
    this.setState({ SelectCurrentUserMode: this.state.SelectCurrentUserMode * (-1) })
  }
  _ModeChangeT = () => () => {
    this.setState({ SelectTargetUserMode: this.state.SelectTargetUserMode * (-1) })
  }
  // async strageを利用するメソッド
  _storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log("error")
    }
  }

  _loadUsers = async () => {
    try {
      const value = await AsyncStorage.getItem("Users");
      if (value !== null) {
        // We have data!!
        console.log(value);
        this.setState({ Users: JSON.parse(value) })
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  _loadPosts = async () => {
    try {
      const value = await AsyncStorage.getItem("Posts");
      if (value !== null) {
        // We have data!!
        console.log(value);
        this.setState({ Posts: JSON.parse(value) })
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  render() {
    return (
      <View style={styles.container} >
        {/* <Text>Current User {this.state.CurrentUser}  |  TargetUser: {this.state.TargetUser} | execData: {this.state.listUpdate} </Text> */}
        <CurrentUserBox info={this.state.Users} CurrentUser={this.state.CurrentUser} _ModeChangeC={this._ModeChangeC} />
        <PopUp _ChangeUser={this._ChangeCurrentUser} mode={this.state.SelectCurrentUserMode} _ModeChange={this._ModeChangeC} />
        <PostInputBox info={this.state.Users} CurrentUser={this.state.CurrentUser} TargetUser={this.state.TargetUser} _onPressPost={this._onPressPost} _ModeChangeT={this._ModeChangeT} _ChangeTargetUser={this._ChangeTargetUser}></PostInputBox>
        <PopUp _ChangeUser={this._ChangeTargetUser} mode={this.state.SelectTargetUserMode} _ModeChange={this._ModeChangeT} />
        {/* 過去の拍手の履歴をリスト形式で表示 */}
        <View style={styles.LogList} >
          <FlatList
            data={this.state.Posts}
            execData={this.state.listUpdate}
            renderItem={({ item }) =>
              (<Post info={this.state.Users} item={item} CurrentUser={this.state.CurrentUser} _onPressHakusyu={this._onPressHakusyu} _listUpdate={this._listUpdate} />)}
          />
        </View>
      </View >
    );
  }
}
class PopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      UserID: "UID0"
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
            <Picker.Item label="こや" value={"UID0"} />
            <Picker.Item label="つし" value={"UID1"} />
            <Picker.Item label="はるか" value={"UID2"} />
            <Picker.Item label="みつ" value={"UID3"} />
            <Picker.Item label="がく" value={"UID4"} />
          </Picker>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Button
              title="select"
              // onPress={
              //   this.props._ChangeUser(this.state.UserID)
              // }
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
class CurrentUserBox extends Component {
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
          <Text style={{ fontSize: 20 }}>From</Text>
          <TouchableOpacity
            onPress={this.props._ModeChangeC()}>
            <Image
              style={{ width: 40, height: 40 }}
              // source={this.props.info[this.props.CurrentUser].img}
              source={{ uri: this.props.info[this.props.CurrentUser].img }}
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 20 }}>{this.props.info[this.props.CurrentUser].name}</Text>
        </View>
        <View style={{ flex: 5, justifyContent: "space-evenly", alignItems: "center" }}>
          {/* 拍手できる，された数をDBから持ってきたい */}
          <Text style={{ fontSize: 20 }} >拍手できる: {this.props.info[this.props.CurrentUser].h1}</Text>
          <Text style={{ fontSize: 20 }} >拍手された: {this.props.info[this.props.CurrentUser].h2}</Text>
        </View>
      </View>
    );
  }
}
class PostInputBox extends Component {
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
          <Text style={{ fontSize: 20 }}>To</Text>
          <TouchableOpacity
            onPress={this.props._ModeChangeT()}>
            <Image
              style={{ width: 40, height: 40 }}

              source={{ uri: this.props.info[this.props.TargetUser].img }}
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
      item: this.props.item,
    };
  }

  _onPressButton = () => {

    list = []
    obj = this.state.item.Hakusyu_log
    console.log(obj)
    for (let k in obj) {
      if (obj[k] != 0) {
        list = list.concat([k])
      }
    }
    console.log(list)
    list.sort(function (a, b) {
      console.log(a + b)
      if (obj[a] > obj[b]) return -1;
    });
    console.log(list)
    mess = ""
    for (let i in list) {
      mess += this.props.info[list[i]].name + "：" + obj[list[i]].toString() + "\n"
    }
    if (list.length == 0) mess = "まだ誰も拍手していません"
    Alert.alert(mess)
  }
  render() {
    return (
      <View style={{ flex: 1, flexDirectionL: "colmun", borderWidth: 0.2, borderColor: "black", margin: 5, backgroundColor: "#FDF5E6", borderRadius: 5 }}>
        {/* 誰から誰に */}
        <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-start", padding: 10 }}>
          <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Image source={{ uri: this.props.info[this.state.item.from].img }} style={{ width: 30, height: 30 }} />
            <Text>{this.props.info[this.props.item.from].name}</Text>
          </View>
          <Text> ➡︎ </Text>
          <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Image source={{ uri: this.props.info[this.state.item.to].img }} style={{ width: 30, height: 30 }} />
            <Text>{this.props.info[this.props.item.to].name}</Text>
          </View>

          {/* <Text>{this.props.info[this.state.item.from].name} to {this.props.info[this.state.item.to].name} sighting {this.props.CurrentUser}</Text> */}
        </View>

        {/* 内容 */}
        <View style={{ flex: 40, justifyContent: "center", alignItems: "center" }}>
          <Text>{this.state.item.text}</Text>
        </View>

        {/* 拍手と時間 */}
        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingRight: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: "center", alignItems: "center" }}>
            <Button
              onPress={() => {
                this.props._onPressHakusyu(this.props.CurrentUser, this.props.item.from, this.props.item.to, this.props.item.total_h, this.props.item.key)()
              }
              }
              title="👏"
              color="black"
              disabled={(this.props.CurrentUser != this.state.item.from && this.props.CurrentUser != this.state.item.to
                && this.props.info[this.props.CurrentUser].h1 > 0) && (this.props.item.Hakusyu_log[this.props.CurrentUser] < 15) ? false : true}
            />

            <TouchableHighlight  onLongPress={this._onPressButton} underlayColor="white">
              <View style={styles.button}>
                <Text >{this.props.item.total_h.toString()}</Text>
              </View>
            </TouchableHighlight>
          </View>
          <Text>{this.state.item.date}</Text>
          {/* <Text>{this.state.item.Hakusyu_log["UID0"]}</Text> */}
        </View>
      </View>
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
    margin: 5,
    backgroundColor: '#E0FFFF',
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: "black"
  },
  TargetUser: {
    // flex: 6,
    flexDirection: "row",
    paddingVertical: 3,
    margin: 5,
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

