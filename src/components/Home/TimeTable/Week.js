import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Week = (props) => {
	const numOfDays = props.data.daysInWeek;

	if (props.data != null) {
		return (
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				snapToInterval={windowWidth}
				scrollEventThrottle={1}
				decelerationRate="fast"
			>
				{
				}
				<View style={{ width: windowWidth, height: windowHeight, justifyContent: "center", alignItems: "center", backgroundColor: "#6fc1f7" }} >
					<Text style={{ color: "white" }} > View 1 </Text>
				</View>
				<View style={{ width: windowWidth, height: windowHeight, justifyContent: "center", alignItems: "center", backgroundColor: "#e56ff7" }} >
					<Text style={{ color: "white" }} > View 2 </Text>
				</View>
				<View style={{ width: windowWidth, height: windowHeight, justifyContent: "center", alignItems: "center", backgroundColor: "#88eb6a" }} >
					<Text style={{ color: "white" }} > View 3 </Text>
				</View>
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