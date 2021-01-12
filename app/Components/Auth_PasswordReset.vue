<template>
  <view :style="{
    marginTop: 20,
    adding: 20,
    flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
    backgroundColor: $root.$data.appOpts.colorStyle.color1}">
    <myHeader title="My Simple Gym Log"
                        :titleColor="$root.$data.appOpts.colorStyle.color3"/>
    <AuthViewInputField name="Username"
                        icon="account"
                        :onTextInputValueChange="onTextInputValueChange"
                        :borderColor="$root.$data.appOpts.colorStyle.color2"
                        :textColor="$root.$data.appOpts.colorStyle.color3"
                        :fieldBackgroundColor="$root.$data.appOpts.colorStyle.color4"/>
    <AuthViewInputField name="Email"
                        icon="email"
                        :onTextInputValueChange="onTextInputValueChange"
                        :borderColor="$root.$data.appOpts.colorStyle.color2"
                        :textColor="$root.$data.appOpts.colorStyle.color3"
                        :fieldBackgroundColor="$root.$data.appOpts.colorStyle.color4"/>
    <AuthViewSubmitButton title="Reset password"
                          :onSubmitButtonClick="onSubmitButtonClick"
                          :textColor="$root.$data.appOpts.colorStyle.color3"
                          :backgroundColor="$root.$data.appOpts.colorStyle.color2"/>
    <AuthViewRedirectText destination="login"
                          textContent="Back to sign in card"
                          :redirectTo="redirectTo"
                          :textColor="$root.$data.appOpts.colorStyle.color3"/>
  </view>
</template>
<script>
import AuthViewInputField from './AuthViewInputField';
import AuthViewSubmitButton from './AuthViewSubmitButton';
import AuthViewRedirectText from './AuthViewRedirectText';
import myHeader from './MyHeader';
import {Alert} from "react-native";
export default {
  name: 'Auth_PasswordReset',
  components: { AuthViewInputField, AuthViewSubmitButton, AuthViewRedirectText, myHeader },
  data: () => {
    return {
      username: '',
      email: '',
    }
  },
  props: {
    navigation: {
      type: Object,
    },
  },
  methods: {
    onTextInputValueChange(childData, childName) {
      if (childName === 'Username')
        this.username = childData;
      else if (childName === 'Email')
        this.email = childData;
    },
    onSubmitButtonClick() {
      if (this.username.length <= 5) {
        Alert.alert('Authentication error', 'Username must be at least 6 characters long');
      } else if (this.username.length > 30) {
        Alert.alert('Authentication error', 'Username must be up to 30 characters long');
      }  else if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email) === false) {
        Alert.alert('Authentication error', 'Please enter valid email address');
      } else {
        this.$root.resetPassword(this.email).then((response) => {
          if (response === true) {
            this.redirectTo('login');
          }
        })
      }
    },
    redirectTo(destination) {
      if (destination === 'login')
        this.navigation.navigate('LoginScreen');
    }
  }
}
</script>
<style>

</style>