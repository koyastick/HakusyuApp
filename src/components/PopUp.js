import React, { Component } from './node_modules/react';
import { Alert, Platform, StyleSheet, Text, TextInput, View, Image, Button, TouchableOpacity, TouchableHighlight, AppRegistry, FlatList, AsyncStorage, Picker } from 'react-native';


export default class PopUp extends Component {
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