import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

const Week = (props) => {
	if (props.data != null) {
		return (
			<View>
			{
				props.data["timetableItems"].map((element, i) => (
					<View key={i}>
						<Text style={{ color: "white", fontSize: 18 }}>{element["subject"].split(',')[0]}</Text>
						<Text style={{ color: "lightgray", fontSize: 14 }}>Rom {element["locations"][0]} - {element["startTime"]}</Text>
					</View>
				))
			}
			</View>
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
export default Week;