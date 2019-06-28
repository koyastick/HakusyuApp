import React, { Component } from './node_modules/react';
import { Alert, Platform, StyleSheet, Text, TextInput, View, Image, Button, TouchableOpacity, AppRegistry, FlatList, AsyncStorage, Picker } from 'react-native';

export default class CurrentUserBox extends Component {
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

