import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Day = (props) => {
	return (
		<View style={{ width: windowWidth, height: windowHeight, justifyContent: "center", alignItems: "center" }} >
			{
				props.data.map((element, i) => (
					<View key={i}>
						<Text style={{ color: "white" }}>{element.subject}</Text>
					</View>
				))
			}
		</View>
	);
}

const Week = (props) => {
	if (props.data != null) {
		const numOfDays = props.data.daysInWeek;
		const dayData = Array.from(Array(numOfDays), x => []);
		
		let dayDataIndex = 0;
		let startDate = props.data.startDate;
		for (let item of props.data.timetableItems) {
			if (item.date != startDate) {
				startDate = item.date;
				dayDataIndex++;
			}
			dayData[dayDataIndex].push(item);
		}

		return (
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				snapToInterval={windowWidth}
				scrollEventThrottle={1}
				decelerationRate="fast"
			>
				{
					dayData.map((day, i) => (
						<Day key={i} data={day} />					
					))
				}
				{/* <View style={{ width: windowWidth, height: windowHeight, justifyContent: "center", alignItems: "center", backgroundColor: "#e56ff7" }} >
					<Text style={{ color: "white" }} > View 2 </Text>
				</View>
				<View style={{ width: windowWidth, height: windowHeight, justifyContent: "center", alignItems: "center", backgroundColor: "#88eb6a" }} >
					<Text style={{ color: "white" }} > View 3 </Text>
				</View> */}
			</ScrollView>
		)
	}
	return (
		<ActivityIndicator 
		color="#00A3FF"
		size="large"
		style={styles.ActivityIndicatorStyle}
		/>
	);
}
// props.data["timetableItems"].map((element, i) => (
// 	<View key={i} styles={{ flex: 1, height: windowHeight, alignItems: "center" }}>
// 		<Text style={{ color: "white", fontSize: 18 }}>{element["subject"].split(',')[0]}</Text>
// 		<Text style={{ color: "lightgray", fontSize: 14 }}>Rom {element["locations"][0]} - {element["startTime"]}</Text>
// 	</View>
// ))	

const styles = StyleSheet.create({
	ActivityIndicatorStyle: {
		flex: 1,
		justifyContent: "center",
		position: "absolute",
		width: windowWidth,
		height: windowHeight,
		top: 0,
		left: 0,
	}
})
export default Week;