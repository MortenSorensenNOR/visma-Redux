import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { BlurView } from 'expo-blur';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const VismaWeb = (props) => {
	const LearnerID = "8955361";
	const thisDate = new Date();
	const [urlState, setUrlState] = React.useState("");
	const [urlHttps, setUrlHttps] = React.useState(false);
	const [dataLoaded, setDataLoaded] = React.useState(false);
	const webViewRef = React.createRef(null);
	const LoadingIndicatorView = () => {
		return (
			<ActivityIndicator 
				color="#00A3FF"
				size="large"
				style={styles.ActivityIndicatorStyle}
			/>
		);
	};

	const onNavChange = (event) => {
		const coreUrlRegex = /([a-zA-Z0-9-]+\.[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)(\/|$)/;
		const coreUrlMatch = event.url.match(coreUrlRegex);
		if (coreUrlMatch) {
			setUrlState(coreUrlMatch[1]);
		}

		const httpsRegex = /https:\/\//;
		const httpsMatch = event.url.match(httpsRegex);
		if (httpsMatch) {
			setUrlHttps(true);
		}
		else {
			setUrlHttps(false);
		}
	}

	const retrieveTimeTableData = ` 
		window.addEventListener("load", () => {
			if (window.location.href == "https://amalieskram-vgs.inschool.visma.no/#/app/dashboard")
			{
				const date = new Date();
				const lastDate = new Date("06/20/2023");
				while (date.getTime() < lastDate.getTime()) {
					try {
					  	fetch("https://amalieskram-vgs.inschool.visma.no/control/timetablev2/learner/${LearnerID}/fetch/ALL/0/current?forWeek=" + [("0" + date.getDate()).slice(-2), ("0" + (date.getMonth() + 1)).slice(-2), date.getFullYear()].join('/'))
					  	.then(response => response.json()).then(data => ReactNativeWebView.postMessage(JSON.stringify({ "status": "success", data })));
					} catch {
					  	ReactNativeWebView.postMessage(JSON.stringify({ "status": "error" }))
					}
					date.setDate(date.getDate() + 7);
				}
			}
		})
	`;

	const onMessage = (message) => {
		setDataLoaded(true);
		processTimetableData(JSON.parse(message));
	}

	const processTimetableData = async (data) => {
		console.log(data["data"])
		try {
			await AsyncStorage.setItem('@timetable/9', JSON.stringify(data["data"]));
		} catch (e) {
			console.log(e);
		}
		// props.navigation.navigate("Home");
	}

	return (
		<View style={{ flex: 1, backgroundColor: "white" }}>
			<StatusBar style="light" />
			{
				dataLoaded ? (
					<View style={{ width: windowWidth, height: windowHeight, zIndex: 2, postion: "absolute", top: 0, left: 0, backgroundColor: "#1C1B1D" }}>
						<LoadingIndicatorView />
					</View>
				) : <></>
			}
			<WebView 
				source={{ uri: "https://amalieskram-vgs.inschool.visma.no/Login.jsp#/" }}
				startInLoadingState={true}
				renderLoading={LoadingIndicatorView}
				onNavigationStateChange={onNavChange}
				javaScriptEnabled={true}
				injectedJavaScript={retrieveTimeTableData}
				onMessage={event => onMessage(event.nativeEvent.data)}
				style={{ marginTop: 90 }}
				ref={webViewRef}
			/>
			<View style={styles.TopBarContainer}>
				<BlurView tint='dark' intensity={100} style={styles.TopBarBluredView} />
				<View style={styles.TopBarContentContainer}>
					<TouchableOpacity style={{  }} onPress={() => props.navigation.navigate("Home")}>
						<Text style={{ fontSize: 17, fontWeight: "500", color: "#329dfa"}}>Done</Text>
					</TouchableOpacity>
					<View style={styles.TopBarURLContainer}>
						{
							urlHttps ? <FontAwesome name="lock" size={17} color="white" /> : <></>
						}
						<Text numberOfLines={1} style={styles.TopBarURL}>{urlState}</Text>
					</View>
					<TouchableOpacity onPress={() => webViewRef.current?.reload()}>
						<Ionicons name="reload" size={20} color="#329dfa" />
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.BottomBarContainer}>
				<BlurView tint='dark' intensity={100} style={styles.BottomBarBluredView} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	ActivityIndicatorStyle: {
		flex: 1,
		justifyContent: "center",
		position: "absolute",
		width: windowWidth,
		height: windowHeight,
		top: 0,
		left: 0,
	},
	TopBarContainer: {
		top: 0, 
		position: "absolute", 
		width: windowWidth
	},
	TopBarBluredView: { 
		position: "absolute", 
		width: windowWidth, 
		height: 90, 
		top: 0 
	},
	TopBarContentContainer: { 
		marginTop: 54, 
		marginHorizontal: 16, 
		justifyContent: "space-between", 
		alignItems: "baseline", 
		flexDirection: "row" 
	},
	TopBarURLContainer: { 
		flexDirection: "row", 
		justifyContent: "center", 
		alignItems: "center"
	},
	TopBarURL: { 
		maxWidth: 200, 
		color: "white", 
		fontSize: 17, 
		fontWeight: "600", 
		flexShrink: 1, 
		marginLeft: 8 
	},
	BottomBarContainer: {
		bottom: 0, 
		position: "absolute", 
		width: windowWidth
	},
	BottomBarBluredView: {
		position: "absolute", 
		width: windowWidth, 
		height: 60, 
		bottom: 0
	}
});
export default VismaWeb;
