<template>
  <ScrollView :style="{
    backgroundColor: $root.$data.appOpts.colorStyle.color1,
  }">
    <view :style="{marginRight: 20, marginLeft: 20, marginTop: 5,}">
    <SettingsCategoryHeader
        title="Account Settings"
        :titleStyle="{
      color: $root.$data.appOpts.colorStyle.color2,
      fontSize: 20,
      alignSelf: 'center',
      fontWeight: 'bold'}"
    />
    <SettingsEditText
        title="Username"
        dialogDescription="Enter new username"
        negativeButtonTitle="Cancel"
        positiveButtonTitle="Save"
        :onValueChange="usernameChange"
        :value="userOpts.username"
        :containerStyle="{
          backgroundColor: $root.$data.appOpts.colorStyle.color4
        }"
        :titleStyle="{
          fontWeight: 'bold',
          color: $root.$data.appOpts.colorStyle.color3
        }"
        :valueStyle="{
          color: $root.$data.appOpts.colorStyle.color3
        }"
    />
    <SettingsDividerLong :dividerStyle="{backgroundColor: $root.$data.appOpts.colorStyle.color1}"/>
    <SettingsEditText
        title="Password"
        dialogDescription="Enter new password"
        negativeButtonTitle="Cancel"
        positiveButtonTitle="Save"
        :onValueChange="passwordChange"
        :value="userOpts.password"
        :containerStyle="{
          backgroundColor: $root.$data.appOpts.colorStyle.color4
        }"
        :titleStyle="{
          fontWeight: 'bold',
          color: $root.$data.appOpts.colorStyle.color3
        }"
        :valueStyle="{
          color: $root.$data.appOpts.colorStyle.color3
        }"
    />
    <SettingsDividerLong :dividerStyle="{backgroundColor: $root.$data.appOpts.colorStyle.color1}"/>
    <SettingsEditText
        title="Email"
        dialogDescription="Enter new email"
        negativeButtonTitle="Cancel"
        positiveButtonTitle="Save"
        :onValueChange="emailChange"
        :value="userOpts.email"
        :containerStyle="{
          backgroundColor: $root.$data.appOpts.colorStyle.color4
        }"
        :titleStyle="{
          fontWeight: 'bold',
          color: $root.$data.appOpts.colorStyle.color3
        }"
        :valueStyle="{
          color: $root.$data.appOpts.colorStyle.color3
        }"
    />
    <SettingsDividerLong :dividerStyle="{backgroundColor: $root.$data.appOpts.colorStyle.color1}"/>

    <SettingsPicker
        title="Gender"
        dialogDescription="Choose your gender"
        :options="genderOptions"
        :onValueChange="genderChange"
        :value="userOpts.gender"
        :valueStyle="{
          color: $root.$data.appOpts.colorStyle.color3
        }"
        :containerStyle="{
          backgroundColor: $root.$data.appOpts.colorStyle.color4
        }"
        :titleStyle="{
          fontWeight: 'bold',
          color: $root.$data.appOpts.colorStyle.color3
        }"
        :modalStyle="{
          header: {
              wrapper: {
                backgroundColor: $root.$data.appOpts.colorStyle.color2,
              },
          },
        }"
    />
    <SettingsDividerLong :dividerStyle="{backgroundColor: $root.$data.appOpts.colorStyle.color1}"/>
    <SettingsEditText
        title="Birth date"
        dialogDescription="Enter your birth date(YYYY-MM-DD)"
        negativeButtonTitle="Cancel"
        positiveButtonTitle="Save"
        :onValueChange="birthDateChange"
        :value="userOpts.birthDate"
        :containerStyle="{
          backgroundColor: $root.$data.appOpts.colorStyle.color4
        }"
        :titleStyle="{
          fontWeight: 'bold',
          color: $root.$data.appOpts.colorStyle.color3
        }"
        :valueStyle="{
          color: $root.$data.appOpts.colorStyle.color3
        }"
    />
    <SettingsDividerLong :dividerStyle="{backgroundColor: $root.$data.appOpts.colorStyle.color1}"/>
    <SettingsButton
        title="Delete account"
        :onPress="deleteAccount"
        :containerStyle="{
          backgroundColor: $root.$data.appOpts.colorStyle.color4
        }"
        :titleStyle="{
          fontWeight: 'bold',
          color: $root.$data.appOpts.colorStyle.color3
        }"
    />
    <SettingsCategoryHeader
        title="Application Configuration"
        :titleStyle="{
          color: $root.$data.appOpts.colorStyle.color2,
          fontSize: 20,
          alignSelf: 'center',
          fontWeight: 'bold'}"/>
    <SettingsSwitch
        title="Sounds off/on"
        :onValueChange="soundChange"
        :value="$root.$data.appOpts.sounds"
        :trackColor="{
          true: $root.$data.appOpts.colorStyle.color2
        }"
        :containerStyle="{
          backgroundColor: $root.$data.appOpts.colorStyle.color4
        }"
        :titleStyle="{
          fontWeight: 'bold',
          color: $root.$data.appOpts.colorStyle.color3
        }"
    />
    <SettingsDividerLong :dividerStyle="{backgroundColor: $root.$data.appOpts.colorStyle.color1}"/>
    <SettingsSwitch
        title="Vibrations off/on"
        :onValueChange="vibrationChange"
        :value="$root.$data.appOpts.vibrations"
        :trackColor="{
          true: $root.$data.appOpts.colorStyle.color2
        }"
        :containerStyle="{
          backgroundColor: $root.$data.appOpts.colorStyle.color4
        }"
        :titleStyle="{
          fontWeight: 'bold',
          color: $root.$data.appOpts.colorStyle.color3
        }"
    />
    <SettingsCategoryHeader
        title="Application Overlook"
        :titleStyle="{
          color: $root.$data.appOpts.colorStyle.color2,
          fontSize: 20,
          alignSelf: 'center',
          fontWeight: 'bold'}"/>
    <SettingsPicker
        title="Visual style"
        dialogDescription="Choose your style"
        :options="styleOptions"
        :onValueChange="visualChange"
        :value="$root.$data.appOpts.colorStyle.name"
        :valueStyle="{
          color: $root.$data.appOpts.colorStyle.color3
        }"
        :containerStyle="{
          backgroundColor: $root.$data.appOpts.colorStyle.color4,
          color: 'black'
        }"
        :titleStyle="{
          fontWeight: 'bold',
          color: $root.$data.appOpts.colorStyle.color3
        }"/>
<!--        :modalStyle="{-->
<!--          innerWrapper: {backgroundColor: 'black', color: 'black', textDecorationColor: 'blue'},-->
<!--          header: {-->
<!--            titleWrapper: {backgroundColor: 'green', color: 'green', textDecorationColor: 'blue'},-->
<!--            title: {backgroundColor: 'orange', color:'orange', textDecorationColor: 'blue'},-->
<!--            description: {backgroundColor: 'aqua', color: 'aqua', textDecorationColor: 'blue'},-->
<!--            closeBtnWrapper: {backgroundColor: 'pink', color: 'pink', textDecorationColor: 'blue'},-->
<!--            },-->
<!--            list: {-->
<!--            wrapper: {backgroundColor: 'black', color: 'black', textDecorationColor: 'blue'},-->
<!--            scrollView: {backgroundColor: 'yellow', color: 'yellow', textDecorationColor: 'blue'},-->
<!--            innerWrapper: {backgroundColor: 'blue', color:'blue', textDecorationColor: 'blue'},-->
<!--            }-->
<!--        }"-->
    </view>
  </ScrollView>
</template>
<script>
import {
  SettingsButton,
  SettingsDividerShort,
  SettingsDividerLong,
  SettingsEditText,
  SettingsCategoryHeader,
  SettingsSwitch,
  SettingsPicker
} from "react-native-settings-components";
import { ScrollView, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
export default {
  name: 'App_Settings',
  components: {
    SettingsPicker, SettingsEditText, SettingsCategoryHeader, SettingsDividerLong, SettingsDividerShort,SettingsSwitch, SettingsButton, ScrollView,
  },
  data() {
    return {
      userOpts: {
        username: '',
        password: '',
        email: '',
        gender: '',
        birthDate: '',
      },
      genderOptions: [
          { label: 'Male', value: 'Male'},
          { label: 'Female', value: 'Female'},
          { label: 'Third gender', value: 'Third gender'},
          { label: 'Bigender', value: 'Bigender'},
          { label: 'Androgyne', value: 'Androgyne'},
          { label: 'Neutrois', value: 'Neutrois'},
          { label: 'Agender', value: 'Agender'},
          { label: 'Intergender', value: 'Intergender'},
          { label: 'Demiboy', value: 'Demiboy'},
          { label: 'Demigirl', value: 'Demigirl'},
      ],
      styleOptions: [
          { label: 'Default dark', value: 'Default dark'},
          { label: 'Default light', value: 'Default light'}
      ]
    }
  },
  props: {
    navigation: {
      type: Object,
    },
  },
  methods: {
    //Account Settings
    async usernameChange(value) {
      const userToken = await AsyncStorage.getItem('@MSGL:TOKEN');
      if (value.length <= 5) {
        Alert.alert('Authentication error', 'Username must be at least 6 characters long');
      } else if (value.length > 30) {
        Alert.alert('Authentication error', 'Username must be up to 30 characters long');
      } else {
        await axios.put(this.$root.backend_url.concat('/client/', userToken,'/update'), {
          what: 'username',
          new: value,
        }).then(async(response) => {
          if (response.data !== 'OK')
            Alert.alert('Settings->username change', response.data);
          else
            await this.updateUserOpts();
        }).catch((error) => {
          Alert.alert('Settings->username change', error.message);
        });
      }
    },
    async passwordChange(value) {
      const userToken = await AsyncStorage.getItem('@MSGL:TOKEN');
      if (value.length <= 5) {
        Alert.alert('Authentication error', 'Password must be at least 6 characters long');
      } else if (value.length > 30) {
        Alert.alert('Authentication error', 'Password must be up to 30 characters long');
      } else {
        await axios.put(this.$root.backend_url.concat('/client/', userToken,'/update'), {
          what: 'password',
          new: value,
        }).then(async(response) => {
          if (response.data !== 'OK')
            Alert.alert('Settings->password change', response.data);
          else
            await this.updateUserOpts();
        }).catch((error) => {
          Alert.alert('Settings->password change', error.message);
        });
      }
    },
    async genderChange(value) {
      const userToken = await AsyncStorage.getItem('@MSGL:TOKEN');
      await axios.put(this.$root.backend_url.concat('/client/', userToken,'/update'), {
          what: 'gender',
          new: value,
        }).then(async(response) => {
          if (response.data !== 'OK')
            Alert.alert('Settings->gender change', response.data);
          else
            await this.updateUserOpts();
        }).catch((error) => {
          Alert.alert('Settings->gender change', error.message);
        });
      },
    async birthDateChange(value) {
      const userToken = await AsyncStorage.getItem('@MSGL:TOKEN');
      if (/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(value) === false) {
        Alert.alert('Authentication error', 'Please enter valid date');
      } else {
        await axios.put(this.$root.backend_url.concat('/client/', userToken, '/update'), {
          what: 'birth_date',
          new: value,
        }).then(async (response) => {
          if (response.data !== 'OK')
            Alert.alert('Settings->birth date change', response.data);
          else
            await this.updateUserOpts();
        }).catch((error) => {
          Alert.alert('Settings->birth date change', error.message);
        });
      }
    },
    async emailChange(value) {
      const userToken = await AsyncStorage.getItem('@MSGL:TOKEN');
      if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value) === false) {
        Alert.alert('Authentication error', 'Please enter valid email address');
      } else {
        await axios.put(this.$root.backend_url.concat('/client/', userToken, '/update'), {
          what: 'email',
          new: value,
        }).then(async (response) => {
          if (response.data !== 'OK')
            Alert.alert('Settings->email change', response.data)
          else
            await this.updateUserOpts();
        }).catch((error) => {
          Alert.alert('Settings->email change', error.message);
        });
      }
    },
    async deleteAccount() {
      Alert.alert('Removing account', 'Are you sure you want to delete this account?',[
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: async () => await this.deleteAccountPart2(),
            style: 'default'
          }]);
    },
    async deleteAccountPart2() {
      const token = await AsyncStorage.getItem('@MSGL:TOKEN').catch((error) => {
        Alert.alert('Settings -> account delete', error.message);
      });
        if (token !== null) {
          await axios.post(this.$root.backend_url.concat('/client/', token, '/delete')).then(async (response) => {
            if (response.data === 'OK') {
              Alert.alert('Removing account', 'Account has been deleted');
              await AsyncStorage.removeItem('@MSGL:TOKEN');
              this.navigation.navigate('LoginScreen');
            } else {
              Alert.alert('Settings -> account delete', response.data);
            }
          }).catch((error) => {
            Alert.alert('Settings -> account delete', error.message);
          })
        } else {
          Alert.alert('Settings -> account delete', 'NULL TOKEN :X');
        }
      },
    //Application Configuration
    async soundChange(value) {
      await AsyncStorage.setItem('@MSGL:Sounds', value.toString());
      await this.$root.updateAppOpts();
    },
    async vibrationChange(value) {
      await AsyncStorage.setItem('@MSGL:Vibrations', value.toString());
      await this.$root.updateAppOpts();
    },
    async visualChange(value) {
      await AsyncStorage.setItem('@MSGL:VisualStyle', value.toString());
      await this.$root.updateAppOpts();
    },
    //Application Customization
    async updateUserOpts() {
      const userToken = await AsyncStorage.getItem('@MSGL:TOKEN');
      await axios.get(this.$root.backend_url.concat('/client/', userToken,'/get')).then((response) => {
        if (response.data[0]["birth_date"] !== null)
          this.userOpts.birthDate = response.data[0]["birth_date"].slice(0, 16);
        if (response.data[0]["email"] !== null)
          this.userOpts.email = response.data[0]["email"];
        if (response.data[0]["username"] !== null)
          this.userOpts.username = response.data[0]["username"];
        if (response.data[0]["password"] !== null)
          this.userOpts.password = response.data[0]["password"];
        if (response.data[0]["gender"] !== null)
          this.userOpts.gender = response.data[0]["gender"];
      }).catch((error) => {
        Alert.alert(error.message);
      });
    },
  },
  async created() {
    await this.updateUserOpts();
  },
}
</script>
<style>

</style>