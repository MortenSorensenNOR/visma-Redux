import React from 'react'
import { View, SafeAreaView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons, Octicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GradientText from './GradientText';
import DateSelector from './DateSelector';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Home = (props) => {
	const testDates = ["1", "2", "3", "4", "5"];
	const testWeek = "9"

	const fetchTimeTableData = async (week) => {
		try {
			console.log("Fetching data...")
			const jsonValue = await AsyncStorage.getItem(`@timetable/${week}`);
    		console.log(jsonValue != null ? JSON.parse(jsonValue) : null);
		} catch (e) {
			console.log(e)
		}
	}

	// fetchTimeTableData(rtestWeek);

	return (
		<SafeAreaView style={styles.PageContainer}>
			{/* Content */}

			{/* Header */}
			<View style={styles.HeaderBar}>
				<BlurView tint='dark' intensity={100} style={{ position: "absolute", height: "100%", width: windowWidth }} />
				<View style={styles.TopBar}>
					<TouchableOpacity>
						<Octicons name="three-bars" size={22} color="white" />
					</TouchableOpacity>
					<GradientText style={styles.title}>visma:Redux</GradientText>
					<TouchableOpacity onPress={() => props.navigation.navigate("Visma")}>
						<Ionicons name="reload" size={22} color="white" />
					</TouchableOpacity>
				</View>
				<DateSelector dates={testDates} week={testWeek} />
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	PageContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#1C1B1D"
	},
	HeaderBar: {
		zIndex: 2,
		top: 0,
		width: "100%",
		position: "absolute",
		paddingHorizontal: 36
	},
	TopBar: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "baseline",
		marginBottom: 12,
		marginTop: 44,
	},
	title: {
		fontSize: 38,
		fontWeight: "600",
		textAlign: "center",
		zIndex: 1
	}
})

export default Home;
