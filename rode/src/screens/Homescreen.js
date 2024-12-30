import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '../../axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, AntDesign, Feather, Ionicons } from '@expo/vector-icons'; // Icons

const HomeScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [hasPaid, setHasPaid] = useState(false);
    const [stream, setStream] = useState('');
    const [id, setId] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [menuVisible, setMenuVisible] = useState(false);
    const [activeMenu, setActiveMenu] = useState('Dashboard');

    // Fetch user data from AsyncStorage
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const name = await AsyncStorage.getItem('name');
                const hasPaid = await AsyncStorage.getItem('hasPaid');
                const stream = await AsyncStorage.getItem('stream');
                const id = await AsyncStorage.getItem('id');

                setName(name || '');
                setHasPaid(hasPaid === 'true');
                setStream(stream || '');
                setId(id || '');
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };

        fetchUserData();
    }, []);

    // Fetch Subjects
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axiosInstance.get('/subjects', { params: { stream } });
                setSubjects(response.data.subjects);
            } catch (error) {
                console.error(error);
            }
        };

        if (stream) {
            fetchSubjects();
        }
    }, [stream]);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] });
    };

    const renderSubject = ({ item }) => (
        <View style={styles.cardContainer}>
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('YearSelectionScreen', { subject: item, stream, id })}
            >
                <MaterialIcons name="architecture" size={50} color="#FFFFFF" />
                <Text style={styles.cardText}>{item}</Text>
                {!hasPaid && (
                    <MaterialIcons name="lock" size={20} color="#FFFFFF" style={styles.lockIcon} />
                )}
            </TouchableOpacity>
        </View>
    );

    const menuItems = [
        { name: 'Dashboard', icon: 'speedometer', screen: 'HomeScreen' },
        { name: 'Profile', icon: 'person', screen: 'ProfileScreen' },
        { name: 'Resources', icon: 'book', screen: 'ResourcesScreen' },
        { name: 'Contact Us', icon: 'mail', screen: 'ContactUsScreen' },
        { name: 'Legal Policy', icon: 'document-text', screen: 'LegalPolicyScreen' },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerCenter}>
                <Image source={require('../Untitled design(2)-Photoroom.png')} style={styles.logo} />
                <Text style={styles.appName}>RODE</Text>
                </View>
                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <Ionicons name="menu" size={30} color="#1F2937" />
                </TouchableOpacity>
            </View>

            {/* Hamburger Menu Modal */}
            <Modal
                visible={menuVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setMenuVisible(false)}
            >
                <View style={styles.menuContainer}>
                    <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.closeMenu}>
                        <Ionicons name="close" size={30} color="#1F2937" />
                    </TouchableOpacity>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.menuItem,
                                activeMenu === item.name && styles.activeMenuItem,
                            ]}
                            onPress={() => {
                                setActiveMenu(item.name);
                                setMenuVisible(false);
                                navigation.navigate(item.screen);
                            }}
                        >
                            <Ionicons name={item.icon} size={24} color={activeMenu === item.name ? '#34D399' : '#1F2937'} />
                            <Text style={styles.menuItemText}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Modal>

            {/* Greeting */}
            <Text style={styles.greetingText}>Hello, {name}!</Text>

            {/* Subjects */}
            <FlatList
                data={subjects}
                renderItem={renderSubject}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.list}
            />

            {/* Bottom Navigation */}
            <View style={styles.navBar}>
                <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                    <AntDesign name="home" size={24} color="#34D399" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ProgressScreen')}>
                    <Feather name="bar-chart" size={24} color="#34D399" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
                    <Feather name="user" size={24} color="#34D399" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#10B981',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  appName: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  greetingText: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', padding: 20, textAlign: 'center' },
  menuContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeMenu: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeMenuItem: {
    backgroundColor: '#D1FAE5',
  },
  menuItemText: {
    fontSize: 18,
    color: '#1F2937',
    marginLeft: 10,
  },
  list: { paddingHorizontal: 20, paddingTop: 10 },
  row: { justifyContent: 'space-between', marginBottom: 20 },
  cardContainer: { flex: 1, paddingHorizontal: 5 },
  card: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cardText: { color: '#FFFFFF', fontSize: 16, marginTop: 10 },
  lockIcon: { position: 'absolute', top: 10, right: 10 },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 10,
  },
});

export default HomeScreen;
