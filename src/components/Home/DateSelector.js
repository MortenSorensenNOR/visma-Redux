import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { BlurView } from 'expo-blur';

const DateSelector = (props) => {
	let datesActive = Array.from(new Array(props.dates.length), active => active = false);
	datesActive[0] = true;
	
    return (
        <View style={styles.Container}>
			<View style={styles.DatesContainer}>
				{
					props.dates.map((date, i) => {
						return (
							<TouchableOpacity key={i} style={styles.Date}>
								{ datesActive[i] ? <Animated.View style={[styles.ActiveDateMarker]}/> : <></>}
								<BlurView tint="light" intensity={5} style={styles.DateBlurView} />
								<Text style={styles.DateText}>{date}</Text>
							</TouchableOpacity>
						)
					})
				}
				<View style={styles.WeekContainer}>
					<BlurView tint="light" intensity={15} style={styles.WeekBlurView} />
					<Text style={styles.WeekText}>Uke {props.week}</Text>
				</View>
			</View>
		</View>
    );
}

const styles = StyleSheet.create({
	Container: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-evenly"
	},
	DatesContainer: {
		flex: 1,
		height: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingBottom: 18
	},
	Date: {
		width: 44,
		height: 44,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#1C1B1D",
		shadowOffset: { x: 4, y: 4 },
		shadowRadius: 2,
		shadowOpacity: 0.75,
		overflow: "hidden"
	},
	ActiveDateMarker: { 
		width: 44, 
        height: 44, 
        position: "absolute", 
        backgroundColor: "#00A3FF",
    },
	DateBlurView: {
		position: "absolute", 
		height: 44, 
		width: 44, 
	},
	DateText: {
		color: "white", 
		fontSize: 18, 
		fontWeight: "700", 
		textAlign: "center"
	},
	WeekContainer: {
		width: 75,
		height: 44,
		justifyContent: "center",
		alignSelf: "center",
		borderRadius: 10,
		overflow: "hidden"
	},
	WeekBlurView: {
		position: "absolute", 
		height: 44, 
		width: 75, 
	},
	WeekText: {
		color: "white", 
		fontSize: 18, 
		fontWeight: "700", 
		textAlign: "center"
	}
});
export default DateSelector
