import React, { useEffect } from 'react';
import { Text, View, StyleSheet, Image, SafeAreaView, useWindowDimensions} from 'react-native';

import AppForm from '../components/AppForm';
import AppFormField from '../components/AppFormField';
import CustomButton from '../components/customButton';
import Logo from '../assets/stemeLogo.png';
import Screen from '../components/Screen';
import TempProfilePhoto from '../assets/tempProfilePhoto.png'
import SubmitButton from '../components/submitButton';
import { auth } from '../navigation/firebase'

import * as Yup from 'yup';






function DashboardScreen({ navigation }) {
    const handleSignOut = () => {
        auth.signOut().then(() => navigation.navigate("SignIn"))
    }
    const {height} = useWindowDimensions();
   
    return (
        <Screen>
            <View style={styles.header}>
                <Text style={styles.text}> {"John Doe"} </Text>
                <Text style={styles.text}> {"Dashboard"} </Text>
            </View>
            <Image source = {TempProfilePhoto} style ={[styles.profilePicture, {height: height * 0.08}, {width: height * 0.08}, {borderRadius: height*0.045}]}/>   
            <View style={styles.stats}>
                <Text style={styles.text}> {"    Points        Tasks Completed       Total Hr"} </Text>
                <Text style={styles.text}> {"     350                     50/80                   6 Hrs"} </Text>
            </View>
            <View style={styles.paddedBox}>
                <Text style={styles.text}> {"Rank 23                                  1738 Points"} </Text>
            </View>
            <View style={styles.paddedBox}>
                <Text style={styles.text}> {"Badge Here                            Planet Here"} </Text>
            </View>
            <View>
                <Text style={styles.text}> {"                 Bottom Icons Go Here"} </Text>
            </View>
        </Screen>
    );
}

export default DashboardScreen;

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        margin: 20,
    },
    profilePictureBorder: {
        borderWidth: 3, 
        borderColor: '#4881CB', 
    },
    profilePicture: {
        margin: 'auto',
        maxHeight: 100,
        maxWidth: 100,
    },
    text: {
        fontSize: 14,
        color: 'white',
        marginTop: -4,
        marginBottom: 10,
        marginRight: 'auto'
    },
    paddedBox: {
        backgroundColor: '#161B45',

        
        borderColor: '#979797',
        borderWidth: 0,
        borderRadius: 15,
        
        padding: 40,
        marginVertical: 15,
        
        textAlign: 'center',
    },
    stats: {
        alignItems: 'center',
        margin: 20,
    }
});