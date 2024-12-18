import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator, Modal, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg'; // Import the QRCode component
import adminCheck from '../components/AdminCheck';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

// This is your Calendar screen component
const CalendarNode = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventStartTime, setEventStartTime] = useState(null);
  const [eventEndTime, setEventEndTime] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [qrVisible, setQrVisible] = useState(false); // State to control QR code visibility
  const [showHideQRCode, setShowHideQRCode] = useState("Show QR Code")
  const qrCodeRef = useRef();

  
    // Function to fetch events from the backe
  const fetchEvents = async (key) => {
    try {
      const serverAddress = 'https://testrunsteme-d7epe6eubzabbpgk.eastus-01.azurewebsites.net/';
      let response = await fetch(serverAddress + key);
      const data = await response.json();
      setEvents(events.concat(data));
      setLoading(false); // Disable loading spinner after fetching
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  // Use `useEffect` to automatically fetch events when the screen loads
  useEffect(() => {
    fetchEvents('general'); // Automatically fetch events when component mounts
    fetchEvents('events');
    fetchEvents('orientations');

    const checkAdminStatus = async () => {
      const adminStatus = await adminCheck();
      setIsAdmin(adminStatus);
    };

    checkAdminStatus();
  }, []);

  

  const dateFormat = (unformattedDate) => {
    if (!unformattedDate) {
      // console.error('Invalid date:', unformattedDate); // Log the invalid date for debugging
      return {}; // Return an empty object to prevent further errors
    }
  
    const months = [
      'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
    ];
  
    const dateParts = unformattedDate.split('T')[0].split('-');
    const timeParts = unformattedDate.split('T')[1]?.split('-')[0]?.split(':');
  
    // Check if date and time parts are valid
    if (dateParts.length < 3 || !timeParts || timeParts.length < 3) {
      console.error('Invalid date or time format:', unformattedDate); // Log the invalid date for debugging
      return {};
    }
  
    const isPM = timeParts[0] > 12;
  
    const data = {
      year: dateParts[0],
      month: dateParts[1],
      monthName: months[parseInt(dateParts[1]) - 1],
      day: dateParts[2],
      hour: isPM ? timeParts[0] - 12 : timeParts[0],
      minute: timeParts[1],
      second: timeParts[2],
      amPM: isPM ? 'PM' : 'AM',
    };
  
    return data;
  };
  

  const openModal = (event, eventStart, eventEnd) => {
    setSelectedEvent(event);
    setEventStartTime(eventStart);
    setEventEndTime(eventEnd);
    setModalVisible(true);
    setQrVisible(false); // Reset QR code visibility when opening the modal
    setShowHideQRCode("Show QR Code");
  } 

  const closeModal = () => {
    setSelectedEvent(null);
    setEventStartTime(null);
    setEventEndTime(null);
    setModalVisible(false);
  }

  const handleCapture = async () => {
    try {
      // Capture QR code as an image
      const uri = await captureRef(qrCodeRef.current, {
        format: 'png',
        quality: 0.8,
      });
  
      // Request permission to access media library
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.granted) {
        await MediaLibrary.saveToLibraryAsync(uri);
        alert('QR code image saved to your library!');
      } else {
        alert('Permission to access the gallery is required!');
      }
    } catch (error) {
      console.error('Failed to capture screenshot', error);
    }
  };
  

  function generateRandomAsciiCode() {
    let code = "";
    for (let i = 0; i < 8; i++) {
      const randomAscii = Math.floor(Math.random() * 94) + 33;
      code += String.fromCharCode(randomAscii);
    }
    return code;
  }


  const toggleQrCode = () => {
    setQrVisible(!qrVisible); // Toggle QR code visibility
    if(showHideQRCode === "Show QR Code"){
      setShowHideQRCode("Hide QR Code");
    }
    else{
      setShowHideQRCode("Show QR Code");
    }
  }

  // Render events or a loading spinner
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <FlatList
        horizontal= {true}
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const startTime = dateFormat(item.start.dateTime);
            const endTime = dateFormat(item.end.dateTime);
            return (

              
              <TouchableOpacity onPress={() => openModal(item, startTime, endTime)}>
               <View style={[{flexDirection: 'column'}]}>



                <View style={styles.eventContainer}>
                  <View style={[{backgroundColor: '#939CEB'}, {height: 50}, {width: 50}, {borderRadius: 25}, {marginLeft: 10}, {alignItems: "center"}, {justifyContent: "center"}, ]}>
                    <Text style={styles.eventDateNumber}>{startTime.day}</Text>
                    <Text style={styles.eventHeader}>{startTime.monthName}</Text>
                  </View>



                  <View style={{marginLeft: 10}}>
                    <Text style={styles.eventHeader}>{startTime.hour + ':' + startTime.minute + ' ' + startTime.amPM}</Text>
                    <Text style={[styles.eventHeader, {fontSize: 10}]}>{item.summary}</Text>
                    <Text style={[styles.eventHeader, {fontSize: 9}, {marginBottom: 2}]}>{
                      startTime.hour + ':' + startTime.minute + ' ' + startTime.amPM + ' - '
                      + endTime.hour + ':' + endTime.minute + ' ' + startTime.amPM
                    }</Text>
                  </View>
                </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{fontWeight:"bold"}}>Event Details</Text>
              {isAdmin && 
                <TouchableOpacity onPress={toggleQrCode}>
                  <Text style={styles.buttonText}>{showHideQRCode}</Text>
                </TouchableOpacity>
                }
                {qrVisible && selectedEvent && (
                  <View ref={qrCodeRef} style={styles.qrContainer}>
                    <QRCode
                      value={"A2k7X9wz|05042008|4:45|6:00|100|Test Event 1|3"} // it's hardcoded for now
                      size={150}
                    />
                  </View>
                )}
                {qrVisible && selectedEvent && (
                  <TouchableOpacity onPress={handleCapture}>
                    <Text style={styles.buttonText}>Save Image</Text>
                  </TouchableOpacity>
                  )}

            {selectedEvent && (
             <View style={styles.container}>
                
                <View>
                  <View style={[{backgroundColor: '#939CEB'}, {height: 50}, {width: 50}, {borderRadius: 25}, {alignItems: "center"}, {justifyContent: "center"}]}>
                    <Text style={styles.eventDateNumber}>{eventStartTime.day}</Text>
                    <Text style={styles.eventHeader}>{eventStartTime.monthName}</Text>
                  </View>
                </View>
              
                <View style={styles.innerContainer}>    
                  {selectedEvent && (
                    <View>
                      <Text>{selectedEvent.summary}</Text>
                      <View>
                        <Text style={{paddingTop:10}}>
                          Time: {""}
                          {eventStartTime.hour + ':' + eventStartTime.minute + ' ' + eventStartTime.amPM + ' - ' +
                            eventEndTime.hour + ':' + eventEndTime.minute + ' ' + eventEndTime.amPM}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>

            </View>
            )}


            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  eventContainer: {
    backgroundColor: '#6A76DE',
    height: 70,
    width: 200,
    borderRadius: 10,
    alignItems: "center",
    display: "flex",
    paddingHorizontal: 10,
    flexDirection: "row",
    margin: 5,
    overflow: 'hidden'
  },
  eventDateNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: 'rgba(255, 255, 255, 1)',
    marginBottom: -3,
    marginTop: -2,
    marginLeft: 0
  },
  eventHeader: {
    fontSize: 12,
    fontWeight: "bold",
    color: 'rgba(255, 255, 255, 1)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row-reverse'
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    paddingRight: 10
    },
  innerContainer: {
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 10,
    width: 350,
    height: 100,
    margin: 5,
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center', // Center the text
    marginTop: 10,
    marginBottom: 0
  },
  qrContainer: {
    marginTop: 20, // Add some space above the QR code
    alignItems: 'center', // Center the QR code
  },
})

export default CalendarNode;
