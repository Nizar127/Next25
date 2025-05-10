import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import DiscoveryScreen from '../screens/DiscoveryScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
//import UploadModal from '../screens/UploadModal';
import PitchCreate from '../screens/PitchCreate';
import CreatePitchButton from '../components/CreatePitchButton';
import CreatePitchModal from '../screens/Modal/CreatePitchModal';
import { View } from 'react-native';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Discovery') {
            iconName = focused ? 'compass' : 'compass-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Upload') {
            return (
              <View style={{
                backgroundColor: '#6366f1',
                width: 55,
                height: 55,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20,
                shadowColor: '#6366f1',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5
              }}>
                <MaterialCommunityIcons name="plus-circle" size={30} color="white" />
              </View>
            );
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Discovery" component={DiscoveryScreen} />
      <Tab.Screen 
          name="CreatePitch" 
          component={CreatePitchModal}
          options={{
            tabBarButton: (props) => <CreatePitchButton {...props} />,
          }}
        />
      {/* <Tab.Screen 
        name="Upload" 
        component={PitchCreate} // Dummy component
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('PitchCreate');
          },
        })}
      /> */}
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        component={MainTabNavigator} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="PitchCreate" 
        component={PitchCreate} 
        options={{ 
          presentation: 'modal',
          headerShown: false 
        }} 
      />
    </Stack.Navigator>
  );
}