import React, { useEffect } from 'react'
import { View, SafeAreaView, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons, Octicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GradientText from './GradientText';
import DateSelector from './DateSelector';
import getWeek from '../../getWeek';

import { Week } from "./TimeTable";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Home = (props) => {
	const [timetableData, setTimeTableData] = React.useState(null);
	const week = getWeek();

	const fetchTimeTableData = async (week) => {
		try {
			const jsonValue = await AsyncStorage.getItem(`@timetable/${week}`);
			if (jsonValue == null) {
				trow ("ERROR: Could not find timetable-data");
			}
			setTimeTableData(JSON.parse(jsonValue));
		} catch (e) {
			console.log(e)
		}
	}

	useEffect(() => {
		fetchTimeTableData(week);
	}, [])

	let weekDates = Array.from(Array(5), (x, i) => x = i + 1);
	if (timetableData != null) {
		let startOfWeekDate = new Date(...timetableData.startDate.split('/').map((x, i) => i == 1 ? parseInt(x) - 1 : parseInt(x)).reverse().splice());
		const daysInWeek = timetableData.daysInWeek;
		weekDates = Array.from(Array(daysInWeek), (x, i) => {
			if (i != 0) {
				startOfWeekDate.setDate(startOfWeekDate.getDate() + 1);
			}
			return startOfWeekDate.getDate();
		});
	}

	return (
		<SafeAreaView style={styles.PageContainer}>
			<Week data={timetableData} />

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
				<DateSelector dates={weekDates} week={week} />
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
