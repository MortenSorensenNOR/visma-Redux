import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Home } from './src/components/Home';
import VismaWeb from './src/components/Web/VismaWeb';

const Stack = createStackNavigator();
export default function App() {
	return (
		<>
		 	<NavigationContainer>
		 		<Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
		 			<Stack.Screen name="Home" component={Home} />
		 			<Stack.Screen name="Visma" component={VismaWeb} />
		 		</Stack.Navigator>
		 	</NavigationContainer>
		</>
	);
}