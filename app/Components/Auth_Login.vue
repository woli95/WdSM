<template>
  <view :style="{
    marginTop: 20,
    adding: 20,
    flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
    backgroundColor: $root.$data.appOpts.colorStyle.color1
  }">
    <AuthViewHeaderText title="My Simple Gym Log"
                        :titleColor="$root.$data.appOpts.colorStyle.color3"/>
    <AuthViewInputField name="Username"
                        icon="account"
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
    <AuthViewSubmitButton title="Sign in"
                          :onSubmitButtonClick="onSubmitButtonClick"
                          :textColor="$root.$data.appOpts.colorStyle.color3"
                          :backgroundColor="$root.$data.appOpts.colorStyle.color2"/>
    <AuthViewRedirectText destination="register"
                          textContent="Still without an account? Sign up here"
                          :redirectTo="redirectTo"
                          :textColor="$root.$data.appOpts.colorStyle.color3"/>
    <AuthViewRedirectText destination="resetPassword"
                          textContent="If you forget your password click here"
                          :redirectTo="redirectTo"
                          :textColor="$root.$data.appOpts.colorStyle.color3"/>
  </view>
</template>
<script>
import AuthViewInputField from './AuthViewInputField';
import AuthViewSubmitButton from './AuthViewSubmitButton';
import AuthViewRedirectText from './AuthViewRedirectText';
import AuthViewHeaderText from './AuthViewHeaderText';
import { Alert } from 'react-native';
export default {
  name: 'Auth_Login',
  components: { AuthViewInputField, AuthViewSubmitButton, AuthViewRedirectText, AuthViewHeaderText },
  props: {
    navigation: {
      type: Object,
    },
  },
  data: () => {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    onTextInputValueChange(childData, childName) {
      if (childName === 'Username')
        this.username = childData;
      else if (childName === 'Password')
        this.password = childData;
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
      } else {
        this.$root.login(this.username, this.password).then((response) => {
          if (response !== false) {
            this.navigation.navigate('MainMenuScreen', { authToken: response});
          }
        });
      }
    },
    redirectTo(destination) {
      if (destination === 'register') {
        this.navigation.navigate('RegisterScreen');
      } else if (destination === 'resetPassword') {
        this.navigation.navigate('PasswordResetScreen');
      }
    },
  },
}
</script>
<style>

</style>