import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

import AppForm from '../components/AppForm';
import AppFormField from '../components/AppFormField';
import CustomButton from '../components/customButton';
import Logo from '../assets/stemeLogo.png';
import Screen from '../components/Screen';
import SubmitButton from '../components/submitButton';
import { auth } from '../navigation/firebase'

import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(4).label('Password'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords do not match'),
});

function SignUpScreen({ navigation }) {
  const handleSignUp = (email, password) => {
    auth.createUserWithEmailAndPassword(email,password).then(userCreditials => {
      const user = userCreditials.user;
      console.log(user.email);
      console.log(user.password)
    }).catch(error => alert(error.message));
  }
  return (
    <Screen>
      <View style={styles.imageContainer}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </View>
      <View style={styles.container}>
        <AppForm
          initialValues={{ email: '', password: '', confirmPassword: '' }}
          onSubmit={({email, password}) => handleSignUp(email,password)}
          validationSchema={validationSchema}
        >
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            name="email"
            placeholder="Email"
            textContentType="emailAddress"
          />
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            name="password"
            placeholder="Password"
            secureTextEntry
            textContentType="password"
          />
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            name="confirmPassword"
            placeholder="Re-type Password"
            secureTextEntry
            textContentType="password"
          />
          <SubmitButton text={'SIGN UP'} />
        </AppForm>
        <CustomButton text={'Forgot your password?'} type="TERTIARY" />
        <CustomButton
          style={styles.createAccount}
          text={'Have an account? Log in '}
          type="TERTIARY"
          onPress={() => navigation.navigate('SignIn')}
        />
      </View>
    </Screen>
  );
}

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  imageContainer: {
    overflow: 'hidden',
    justifyContent: 'center',
  },
  logo: {
    height: 180,
    borderRadius: 90,
    width: 180,
    marginTop: 50,
    marginBottom: 20,
  },
  createAccount: {
    position: 'relative',
    top: 30,
  },
});