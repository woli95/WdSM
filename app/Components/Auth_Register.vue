<template>
  <view :style="{
    marginTop: 20,
    adding: 20,
    flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
    backgroundColor: $root.$data.appOpts.colorStyle.color1}">
    <AuthViewHeaderText title="My Simple Gym Log"
                        :titleColor="$root.$data.appOpts.colorStyle.color3"/>
    <AuthViewInputField name="Username"
                        icon="account"
                        :onTextInputValueChange="onTextInputValueChange"
                        borderColor="$root.$data.appOpts.colorStyle.color2"
                        :textColor="$root.$data.appOpts.colorStyle.color3"
                        :fieldBackgroundColor="$root.$data.appOpts.colorStyle.color4"/>
    <AuthViewInputField name="Email"
                        icon="email"
                        :onTextInputValueChange="onTextInputValueChange"
                        :borderColor="$root.$data.appOpts.colorStyle.color2"
                        :textColor="$root.$data.appOpts.colorStyle.color3"
                        :fieldBackgroundColor="$root.$data.appOpts.colorStyle.color4"/>
    <AuthViewInputField name="Retype email"
                        icon="refresh"
                        :onTextInputValueChange="onTextInputValueChange"
                        :borderColor="$root.$data.appOpts.colorStyle.color2"
                        :textColor="$root.$data.appOpts.colorStyle.color3"
                        :fieldBackgroundColor="$root.$data.appOpts.colorStyle.color4"/>
    <AuthViewInputField name="Password"
                        icon="lock"
                        :onTextInputValueChange="onTextInputValueChange"
                        :isPassword=true
                        :borderColor="$root.$data.appOpts.colorStyle.color2"
                        :textColor="$root.$data.appOpts.colorStyle.color3"
                        :fieldBackgroundColor="$root.$data.appOpts.colorStyle.color4"/>
    <AuthViewInputField name="Retype password"
                        icon="refresh"
                        :onTextInputValueChange="onTextInputValueChange"
                        :isPassword=true
                        borderColor="$root.$data.appOpts.colorStyle.color2"
                        :textColor="$root.$data.appOpts.colorStyle.color3"
                        :fieldBackgroundColor="$root.$data.appOpts.colorStyle.color4"/>
    <AuthViewSubmitButton title="Sign up"
                          :onSubmitButtonClick="onSubmitButtonClick"
                          :textColor="$root.$data.appOpts.colorStyle.color3"
                          :backgroundColor="$root.$data.appOpts.colorStyle.color2"/>
    <AuthViewRedirectText destination="login"
                          textContent="Have an account? Sign in here"
                          :redirectTo="redirectTo"
                          :textColor="$root.$data.appOpts.colorStyle.color3"/>
  </view>
</template>
<script>
import AuthViewInputField from './AuthViewInputField';
import AuthViewSubmitButton from './AuthViewSubmitButton';
import AuthViewRedirectText from './AuthViewRedirectText';
import AuthViewHeaderText from './AuthViewHeaderText';
import {Alert} from "react-native";
export default {
  name: 'Auth_Register',
  components: { AuthViewInputField, AuthViewSubmitButton, AuthViewRedirectText, AuthViewHeaderText },
  data: () => {
    return {
      username: '',
      password: '',
      email: '',
      retypedEmail: '',
      retypedPassword: '',
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
      else if (childName === 'Password')
        this.password = childData;
      else if (childName === 'Email')
        this.email = childData.toLowerCase();
      else if (childName === 'Retype password')
        this.retypedPassword = childData;
      else if (childName === 'Retype email')
        this.retypedEmail = childData.toLowerCase();
    },
    onSubmitButtonClick() {
      if (this.username.length <= 5) {
        Alert.alert('Authentication error', 'Username must be at least 6 characters long');
      } else if (this.username.length > 30) {
        Alert.alert('Authentication error', 'Username must be up to 30 characters long');
      } else if (this.password.length <= 5) {
        Alert.alert('Authentication error', 'Password must be at least 6 characters long');
      } else if (this.password.length > 30) {
        Alert.alert('Authentication error', 'Password must be up to 30 characters long');
      } else if (this.password !== this.retypedPassword) {
        Alert.alert('Authentication error', 'Retyped password does not match with password');
      } else if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email) === false) {
        Alert.alert('Authentication error', 'Please enter valid email address');
      } else if (this.email !== this.retypedEmail) {
        Alert.alert('Authentication error', 'Retyped email does not match with email');
      } else {
        this.$root.register(this.username, this.email, this.password).then((response) => {
          if (response === true) {
            this.redirectTo('login');
          }
        });
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