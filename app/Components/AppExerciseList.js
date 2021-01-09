import React from 'react';
import { FlatList, StyleSheet, Text, View,  } from 'react-native';
import { TouchableOpacity } from "react-native";
import { SettingsDividerLong } from 'react-native-settings-components';

const AppExerciseList = (props) => {
    const pressed = (item) => {
        props.onItemLongPress(item);
    }
    return (
        <View style={{
            flex: 1,
            width:250,
            paddingTop: 5,
            borderWidth:1,
            backgroundColor: props.bgColor,
        }}>
            <Text style={{
                fontWeight: 'bold',
                textAlign: 'center',
                color: props.headerColor,
                fontSize: 25,
            }}>{props.title}</Text>
            <SettingsDividerLong dividerStyle={{backgroundColor: props.dividerColor, marginTop: 5,}}/>
            <FlatList
                data={props.list}
                renderItem={({item}) =>
                    <View>
                        <TouchableOpacity onLongPress={() => pressed(item)}>
                            <Text style={{
                                padding: 8,
                                fontSize: 22,
                                fontStyle: 'italic',
                                color: props.itemTextColor }
                            }><Text style={{color: props.headerColor}}>-></Text> {item.name.toString()}</Text>
                        </TouchableOpacity>
                        <SettingsDividerLong dividerStyle={{backgroundColor: props.dividerColor, marginTop: 5,}}/>
                    </View>
                }
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}

export default AppExerciseList;