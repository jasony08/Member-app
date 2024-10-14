import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

import AppForm from '../components/AppForm';
import AppFormField from '../components/AppFormField';
import CustomButton from '../components/customButton';
import Logo from '../assets/stemeLogo.png';
import Screen from '../components/Screen';
import SubmitButton from '../components/submitButton';
import { auth, db } from '../navigation/firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import Toast from 'react-native-toast-message';

import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required().label('Full Name'),
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords do not match'),
});

function SignUpScreen({ navigation }) {
  const showToast = (message, type) => {
    Toast.show({
      type,
      position: 'top',
      text1: message,
      visibilityTime: 4000,
    });
  };

  const writeUserData = function (userUID, username, email, imageUrl) {
    const reference = ref(db, 'users/' + userUID);
    set(reference, {
      username: username,
      email: email,
      profile_picture: imageUrl,
    });
  };

  const handleSignUp = async (fullName, email, password) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
  
      await updateProfile(user, {
        displayName: fullName,
      });
  
      // Send email verification
      await sendEmailVerification(user);
  
      writeUserData(user.uid, fullName, email, '#');
  
      // Navigate to a new screen or show a message to check email verification
      navigation.navigate('VerifyEmail'); // Assuming you have a 'VerifyEmail' screen
  
    } catch (error) {
      let errorMessage;
  
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'The email address is not valid.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'This email address is already in use.';
          break;
        default:
          errorMessage = 'An error occurred. Please try again.';
      }
  
      // Show error message (e.g., using an alert or a state variable)
      showToast(errorMessage, 'error');
    }
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.imageContainer}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </View>
      <View style={styles.container}>
        <AppForm
          initialValues={{ fullName: '', email: '', password: '', confirmPassword: '' }}
          onSubmit={({ fullName, email, password }) => handleSignUp(fullName, email, password)}
          validationSchema={validationSchema}
        >
          <AppFormField
            autoCapitalize="words"
            autoCorrect={false}
            name="fullName"
            placeholder="Full Name"
            width="100%"
          />
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            name="email"
            placeholder="Email"
            textContentType="emailAddress"
            width="100%"
          />
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            name="password"
            placeholder="Password"
            secureTextEntry
            textContentType="password"
            width="100%"
          />
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            name="confirmPassword"
            placeholder="Re-type Password"
            secureTextEntry
            textContentType="password"
            width="100%"
          />
          <SubmitButton text={'SIGN UP'} />
        </AppForm>
        <CustomButton
          style={styles.createAccount}
          text={'Have an account? Log in '}
          type="TERTIARY"
          onPress={() => navigation.navigate('SignIn')}
        />
      </View>
      <Toast ref={(ref) => Toast.setRef(ref)} />
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
    position: 'absolute',
    bottom: '-20%',
  },
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
