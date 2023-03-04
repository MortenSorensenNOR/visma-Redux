import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Share, Linking, Alert } from 'react-native';
import { Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { BlurView } from 'expo-blur';
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { LearnerID } from '../../../config';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// Component variables
const beginOfYear = new Date(2023, 0, 1);
const lastSchoolDate = new Date(2023, 6, 20);
const numberOfWeeks = Math.ceil((lastSchoolDate - beginOfYear) / (24 * 60 * 60 * 1000 * 7));
const fetchedWeeks = Array.from(new Array(numberOfWeeks), e => e = 0);

const VismaWeb = (props) => {
	// Refs
	const webViewRef = React.createRef(null);
	
	// States
	const [currentURL, setCurrentURL] = React.useState("");
	const [urlState, setUrlState] = React.useState("");
	const [urlHttps, setUrlHttps] = React.useState(false);
	const [dataLoaded, setDataLoaded] = React.useState(false);
	const [canGoBack, setCanGoBack] = React.useState(0);
	const [canGoForward, setCanGoForward] = React.useState(0);

	// Injected js
	const retrieveTimeTableData = ` 
		window.addEventListener("load", () => {
			if (window.location.href == "https://amalieskram-vgs.inschool.visma.no/#/app/dashboard")
			{
				const date = new Date();
				const beginOfYear = new Date(date.getFullYear(), 0, 1);
				const lastDate = new Date(2023, 6, 20);
				const iterableDate = new Date(date.getFullYear(), 0, 1);
				while (iterableDate.getTime() < lastDate.getTime()) {
					var dayNr = Math.ceil((iterableDate - beginOfYear) / (24 * 60 * 60 * 1000));
					let week = Math.ceil((dayNr + beginOfYear.getDay()) / 7);
					try {
						  fetch("https://amalieskram-vgs.inschool.visma.no/control/timetablev2/learner/${LearnerID}/fetch/ALL/0/current?forWeek=" + [("0" + date.getDate()).slice(-2), ("0" + (date.getMonth() + 1)).slice(-2), date.getFullYear()].join('/'))
						  .then(response => response.json()).then(data => ReactNativeWebView.postMessage(JSON.stringify({ "status": "success", week, data })));
					} catch {
						  ReactNativeWebView.postMessage(JSON.stringify({ "status": "error" }))
					}
					iterableDate.setDate(iterableDate.getDate() + 7);
				}
			}
		})
	`;

	// Component functions 
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

		setCurrentURL(event.url);
		setCanGoBack(event.canGoBack);
		setCanGoForward(event.canGoForward);
	}

	const onMessage = (message) => {
		setDataLoaded(true);
		processTimetableData(JSON.parse(message));
	}

	const processTimetableData = async (data) => {
		try {
			await AsyncStorage.setItem(`@timetable/${data["week"]}`, JSON.stringify(data["data"]));
			fetchedWeeks[data.week] = 1;
		} catch (e) {
			console.log(e);
		}
		const elementsLoaded = fetchedWeeks.reduce((a, b) => a + b, 0); 
		if (elementsLoaded == fetchedWeeks.length) {
			props.navigation.navigate("Home");
		}
	}

	const onShare = async (url) => {
		try {
			const result = await Share.share({ url });
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// shared with activity type of result.activityType
				} else {
					// shared
				}
			} else if (result.action === Share.dismissedAction) {
				// dismissed
			}
		} 
		catch (error) {
			Alert.alert(error.message);
		}
	}

	const onOpenUrl = (url) => {
		Linking.canOpenURL(url).then(supported => {
			if (supported) {
				Linking.openURL(url)
			} else {
				Alert("Could not open url")
			}
		})
	}

	return (
		<View style={{ flex: 1, backgroundColor: "white" }}>
			<StatusBar style="light" />
			{
				dataLoaded ? (
					<View style={{ width: windowWidth, height: windowHeight, zIndex: 3, postion: "absolute", top: 0, left: 0, backgroundColor: "#1C1B1D" }}>
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
				contentInset={{top: 90}}
				ref={webViewRef}
			/>
			<View style={styles.TopBarContainer}>
				<BlurView tint='dark' intensity={100} style={styles.TopBarBluredView} />
				<View style={styles.TopBarContentContainer}>
					<TouchableOpacity style={{  }} onPress={() => props.navigation.navigate("Home")}>
						<Text style={{ fontSize: 17, fontWeight: "500", color: "#00A3FF"}}>Done</Text>
					</TouchableOpacity>
					<View style={styles.TopBarURLContainer}>
						{
							urlHttps ? <FontAwesome name="lock" size={17} color="white" style={{ position: "absolute", left: -17 }} /> : <></>
						}
						<Text numberOfLines={1} style={styles.TopBarURL}>{urlState}</Text>
					</View>
					<TouchableOpacity onPress={() => webViewRef.current?.reload()}>
						<Ionicons name="reload" size={20} color="#00A3FF" />
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.BottomBarContainer}>
				<BlurView tint='dark' intensity={100} style={styles.BottomBarBluredView} />
				<View style={styles.BottomBarContentContainer}>
					<TouchableOpacity onPress={() => webViewRef.current?.goBack()}>
						<AntDesign name="left" size={24} color={canGoBack ? "#00A3FF" : "#696969"} />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => webViewRef.current?.goForward()}>
						<AntDesign name="right" size={24} color={canGoForward ? "#00A3FF" : "#696969"} />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => onShare(currentURL)}>
						<Ionicons name="ios-share-outline" size={26} color="#00A3FF" />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => onOpenUrl(currentURL)}>
						<Ionicons name="ios-compass-outline" size={26} color="#00A3FF" />
					</TouchableOpacity>
				</View>
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
		zIndex: 2,
		top: 0, 
		position: "absolute", 
		width: windowWidth,
	},
	TopBarBluredView: { 
		position: "absolute", 
		width: windowWidth, 
		height: "100%",
		top: 0 
	},
	TopBarContentContainer: { 
		marginTop: 54, 
		marginHorizontal: 16,
		paddingBottom: 16,
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
		maxWidth: 210, 
		color: "white", 
		fontSize: 17, 
		fontWeight: "600", 
		flexShrink: 1, 
	},
	BottomBarContainer: {
		zIndex: 2,
		bottom: 0, 
		position: "absolute", 
		width: windowWidth
	},
	BottomBarBluredView: {
		position: "absolute", 
		width: windowWidth, 
		height: "100%",
		bottom: 0
	},
	BottomBarContentContainer: {
		marginTop: 16, 
		marginBottom: 46, 
		marginHorizontal: 24,
		justifyContent: "space-between", 
		alignItems: "baseline", 
		flexDirection: "row" 
	}
});
export default VismaWeb;