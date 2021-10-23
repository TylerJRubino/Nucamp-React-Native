import React, { Component } from "react";
import Home from "./HomeComponent";
import Directory from "./DirectoryComponent";
import CampsiteInfo from "./CampsiteInfoComponent";
import About from "./AboutComponent";
import Contact from "./ContactComponent";
import Reservation from "./ReservationComponent";
import Favorites from "./FavoritesComponent";
import Login from "./LoginComponent";
import {
	View,
	Platform,
	StyleSheet,
	Text,
	ScrollView,
	Image,
	Alert,
	ToastAndroid,
} from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import { createAppContainer } from "react-navigation";
import { Icon } from "react-native-elements";
import SafeAreaView from "react-native-safe-area-view";
import { connect } from "react-redux";
import {
	fetchCampsites,
	fetchComments,
	fetchPromotions,
	fetchPartners,
} from "../redux/ActionCreators"; //Importing the "thunked" action creators
import NetInfo from "@react-native-community/netinfo";
import Constants from "expo-constants";

const mapDispatchToProps = {
	//instead of "mapStateToProps" function here, create the "mapDispatchToProps" object here and supply it with the name of the four action creators we are going to  use to dispatch actions. These are the action creators that have been "thunked" in order to send asynchrous calls using "fetch" to the server to bring back data from the server. Using this object allows us to access the action creators as props (just like "mapStateToProps" allowed us to access the state data as props)
	fetchCampsites,
	fetchComments,
	fetchPromotions,
	fetchPartners,
};

const DirectoryNavigator = createStackNavigator(
	// createStackNavigator is a Function that has one requred argument called the route-configs-object which is where we set what components will be available for the stack. We will set it to Directory and CampsiteInfo
	{
		Directory: {
			screen: Directory,
			navigationOptions: ({ navigation }) => ({
				//Set navigation options for this particular screen, give it a function and pass in the built in "navigation" prop
				headerLeft: (
					<Icon //Add an Icon in the left side of the header
						name="list"
						type="font-awesome"
						iconStyle={styles.stackIcon} //Built in property, "styles.stackIcon" is a custom style that we built.
						onPress={() => navigation.toggleDrawer()} //Built in property, use to make the Icon interactive. Use the "navigation" prop's built in "toggleDrawer" method.
					/>
				),
			}),
		},
		CampsiteInfo: { screen: CampsiteInfo },
	},
	{
		//Optional second argument, styles apply to both Directory and CampsiteInfo screens
		initialRouteName: "Directory", //When the navigator is open, it will default to showing "Directory" component
		defaultNavigationOptions: {
			//Configure settings for the header
			headerStyle: {
				backgroundColor: "#5637DD",
			},
			headerTintColor: "#fff",
			headerTitleStyle: {
				color: "#fff",
			},
		},
	}
);

const HomeNavigator = createStackNavigator(
	{
		Home: { screen: Home },
	},
	{
		defaultNavigationOptions: ({ navigation }) => ({
			//Set navigation options for all screens in this navigator (but there is only one), give it a function and pass in the built in "navigation" prop
			headerStyle: {
				backgroundColor: "#5637DD",
			},
			headerTintColor: "#fff",
			headerTitleStyle: {
				color: "#fff",
			},
			headerLeft: (
				<Icon
					name="home"
					type="font-awesome"
					iconStyle={styles.stackIcon}
					onPress={() => navigation.toggleDrawer()}
				/>
			),
		}),
	}
);

const AboutNavigator = createStackNavigator(
	{
		About: { screen: About },
	},
	{
		defaultNavigationOptions: ({ navigation }) => ({
			//Set navigation options for all screens in this navigator (but there is only one), give it a function and pass in the built in "navigation" prop
			headerStyle: {
				backgroundColor: "#5637DD",
			},
			headerTintColor: "#fff",
			headerTitleStyle: {
				color: "#fff",
			},
			headerLeft: (
				<Icon
					name="info-circle"
					type="font-awesome"
					iconStyle={styles.stackIcon}
					onPress={() => navigation.toggleDrawer()}
				/>
			),
		}),
	}
);

const ContactNavigator = createStackNavigator(
	{
		Contact: { screen: Contact },
	},
	{
		defaultNavigationOptions: ({ navigation }) => ({
			//Set navigation options for all screens in this navigator (but there is only one), give it a function and pass in the built in "navigation" prop
			headerStyle: {
				backgroundColor: "#5637DD",
			},
			headerTintColor: "#fff",
			headerTitleStyle: {
				color: "#fff",
			},
			headerLeft: (
				<Icon
					name="address-card"
					type="font-awesome"
					iconStyle={styles.stackIcon}
					onPress={() => navigation.toggleDrawer()}
				/>
			),
		}),
	}
);

const ReservationNavigator = createStackNavigator(
	{
		Reservation: { screen: Reservation },
	},
	{
		defaultNavigationOptions: ({ navigation }) => ({
			headerStyle: {
				backgroundColor: "#5637DD",
			},
			headerTintColor: "#fff",
			headerTitleStyle: {
				color: "#fff",
			},
			headerLeft: (
				<Icon
					name="tree"
					type="font-awesome"
					iconStyle={styles.stackIcon}
					onPress={() => navigation.toggleDrawer()}
				/>
			),
		}),
	}
);

const FavoritesNavigator = createStackNavigator(
	{
		Favorites: { screen: Favorites },
	},
	{
		defaultNavigationOptions: ({ navigation }) => ({
			headerStyle: {
				backgroundColor: "#5637DD",
			},
			headerTintColor: "#fff",
			headerTitleStyle: {
				color: "#fff",
			},
			headerLeft: (
				<Icon
					name="heart"
					type="font-awesome"
					iconStyle={styles.stackIcon}
					onPress={() => navigation.toggleDrawer()}
				/>
			),
		}),
	}
);

const LoginNavigator = createStackNavigator(
	{
		Login: { screen: Login },
	},
	{
		defaultNavigationOptions: ({ navigation }) => ({
			headerStyle: {
				backgroundColor: "#5637DD",
			},
			headerTintColor: "#fff",
			headerTitleStyle: {
				color: "#fff",
			},
			headerLeft: (
				<Icon
					name="sign-in"
					type="font-awesome"
					iconStyle={styles.stackIcon}
					onPress={() => navigation.toggleDrawer()}
				/>
			),
		}),
	}
);

const CustomDrawerContentComponent = (
	props //Recieve "props" as its parameter and will return a view of our customized drawer
) => (
	<ScrollView>
		<SafeAreaView //specifically for the iPhoneX, takes into account the rounded corners and camera notch. Default drawer component already includes this. But has to be added here because we are overriding the default.
			style={styles.container} //recommended properties to set as by React Navigation Docs
			forceInset={{
				top: "always",
				horizontal: "never",
			}} /*recommended properties to set as by React Navigation Docs*/
		>
			<View style={styles.drawerHeader}>
				<View
					style={{
						flex: 1,
					}} /*First inner view will take up 1/3 of the space of the outer view due to "flex: 1"*/
				>
					<Image
						source={require("./images/logo.png")}
						style={styles.drawerImage}
					/>
				</View>
				<View
					style={{
						flex: 2,
					}} /*Second inner view will take up 2/3 of the space of the outer view due to "flex: 2"*/
				>
					<Text style={styles.drawerHeaderText}>NuCamp</Text>
				</View>
			</View>
			<DrawerItems
				{...props} /*Show all the above items in the side draw by passing in as spread out (...) "props"*/
			/>
		</SafeAreaView>
	</ScrollView>
);

const MainNavigator = createDrawerNavigator(
	//Needs an object that contains the screens that will be in the drawer for first object, can take optional second argument
	{
		Login: {
			//Add "Login" screen to the top of the DrawerNavigator because we want it to be the first option in the list. However, now every time the app is loaded, the Login screen will be loaded first, which is not what we want. Fixed by adding "initialRouteName: 'Home'" option to the bottom of the drawer navigator in the options object
			screen: LoginNavigator,
			navigationOptions: {
				drawerIcon: ({ tintColor }) => (
					<Icon
						name="sign-in"
						type="font-awesome"
						size={24}
						color={tintColor}
					/>
				),
			},
		},
		Home: {
			screen: HomeNavigator,
			navigationOptions: {
				//setting up navigation options for the HomeNavigator. Set up as objects containing the "drawerIcon" property
				drawerIcon: (
					{ tintColor } //"tintColor" is a default thing, the color will change depending on if this is the active screen or not. Put in the arrow function so it can be passed into the <Icon>
				) => (
					<Icon
						name="home"
						type="font-awesome"
						size={24}
						color={tintColor}
					/>
				),
			},
		},
		Directory: {
			screen: DirectoryNavigator,
			navigationOptions: {
				drawerIcon: ({ tintColor }) => (
					<Icon
						name="list"
						type="font-awesome"
						size={24}
						color={tintColor}
					/>
				),
			},
		},
		Reservation: {
			screen: ReservationNavigator,
			navigationOptions: {
				drawerLabel: "Reserve Campsite",
				drawerIcon: ({ tintColor }) => (
					<Icon
						name="tree"
						type="font-awesome"
						size={24}
						color={tintColor}
					/>
				),
			},
		},
		Favorites: {
			screen: FavoritesNavigator,
			navigationOptions: {
				drawerLabel: "My Favorites",
				drawerIcon: ({ tintColor }) => (
					<Icon
						name="heart"
						type="font-awesome"
						size={24}
						color={tintColor}
					/>
				),
			},
		},
		About: {
			screen: AboutNavigator,
			navigationOptions: {
				drawerLabel: "About Us", //This overrides the label for the drawer (which says "About" right now, not sure from where???)
				drawerIcon: ({ tintColor }) => (
					<Icon
						name="info-circle"
						type="font-awesome"
						size={24}
						color={tintColor}
					/>
				),
			},
		},
		Contact: {
			screen: ContactNavigator,
			navigationOptions: {
				drawerLabel: "Contact Us", //This overrides the label for the drawer (which says "Contact" right now, not sure from where???)
				drawerIcon: ({ tintColor }) => (
					<Icon
						name="address-card"
						type="font-awesome"
						size={24}
						color={tintColor}
					/>
				),
			},
		},
	},
	{
		initialRouteName: "Home", //Added so that the 'Home' screen will be the first screen loaded as opposed to the login screen
		drawerBackgroundColor: "#CEC8FF",
		contentComponent: CustomDrawerContentComponent, //Connect "CustomDrawerContentComponenet" to the drawer navigator. Set the "contentComponent:" propery to the "CustomDrawerContentComponenet" constant and that will tell the navigator to use this component to render the content of the side drawer
	}
);

const AppNavigator = createAppContainer(MainNavigator); //Stack navigator needs to be passed to the imported function "createAppContainer". Will return a react component that connects top level navigator to the react native application environment.

class Main extends Component {
	componentDidMount() {
		//We want the <Main> component to call the action creators after the <Main> component has been created. So use the built in "componentDidMount" lifecycle method to do this and pass it the action creators
		this.props.fetchCampsites();
		this.props.fetchComments();
		this.props.fetchPromotions();
		this.props.fetchPartners();

		this.showNetInfo();
	}

	componentWillUnmount() {
		//React lifecycle method
		this.unsubscribeNetInfo(); //Call the method we created here to stop listening for connection changes when the <Main> component unmounts
	}

	showNetInfo = async () => {
		const connectionInfo = await NetInfo.fetch(); //Use "NetInfo.fetch()" which has no parameters and will return a promise that resolves to a "NetInfoState" object to get network information just once about the current network connection. WHEN THIS LINE WAS NOT USING AWAIT / ASYNC: How this line works: The "NetInfo.fetch()" method returns a promise, the ".then" activates once the promise is resolved into the "netInfoState" object back which is then renamed "connectionInfo" (can be named anything) and passed into this arrow function as the argument. Using ".then" instead of "async" because that's what the docs are written as, but could be done with "async".
		if (connectionInfo) {
			Platform.OS === "ios" //Check for the operating system of the device using the "Platform.OS" API and a terinary operator
				? Alert.alert(
						"Initial Network Connectivity Type:",
						connectionInfo.type
				  ) //If IOS, send an alert to display connection info
				: ToastAndroid.show(
						"Initial Network Connectivity Type: " + //If not IOS, use React Native "ToastAndroid" API to pop up a toast. It has a method ".show" that takes 2 arguments, the first is the text you want to display, the second is an interger for how long to show the toast.  ".SHORT" is 2 seconds, ".LONG" is 3.5 seconds.
							connectionInfo.type,
						ToastAndroid.LONG
				  );
		}

		//"NetInfo.addEventListener" provides a function that can be used to unsuscribe the listener as its own return value. We'll want to save that function by assigning it to a method on the class, do this by naming the function with "this.". Must use "this" because we are already inside a method to specify that we are creating it as a method on the parent class rather than as a local variable within the "componentDidMount".

		this.unsubscribeNetInfo = NetInfo.addEventListener((connectionInfo) => {
			//Call "NetInfo.addEventListener" which takes a callback function in its parameter list. The callback function will automatically have access to the "netInfoState" object as an argument. So we pass it in and rename it "connectionInfo".
			this.handleConnectivityChange(connectionInfo); //Call another class method named "this.handleConnectivityChange" which we wrote. Pass it the "connectionInfo" / "netInfoState object"
		});
	};

	handleConnectivityChange = (connectionInfo) => {
		//When there is a change in the connection state, will have app respond by poping up a toast/alert with a message about the change that will vary based on the connection type
		let connectionMsg = "You are now connected to an active network."; //Set up a variable using the "let" keyword so that the variable's value can be reassigned in the code below.
		switch (
			connectionInfo.type //Switch statement that takes the type property (docs show what the types are) and re-assigns the variable's value to a new message.
		) {
			case "none":
				connectionMsg = "No network connection is active.";
				break;
			case "unknown":
				connectionMsg = "The network connection state is now unknown.";
				break;
			case "cellular":
				connectionMsg = "You are now connected to a cellular network.";
				break;
			case "wifi":
				connectionMsg = "You are now connected to a WiFi network.";
				break; //Last "break" is technically not necessary. Not using a "default" because the "connectionMsg" is already initialized in the variable above.
		}
		Platform.OS === "ios" //Check for the platform operating system
			? Alert.alert("Connection change:", connectionMsg) //If ISO, generate alert with the "connectionMsg"
			: ToastAndroid.show(connectionMsg, ToastAndroid.LONG); //If Android, generate toast with "connectionMsg"
	};

	render() {
		return (
			<View
				style={{
					flex: 1,
					paddingTop:
						Platform.OS === "ios" ? 0 : Constants.statusBarHeight, //Patform gets the operating system and allows us to use a tertinary operator to set different padding top for IOS
				}}
			>
				<AppNavigator />
			</View> // NOTE FOR LINE 37: container for the DirectoryNavigator which contains the screens for both the DirectoryComponent and CampsiteInfoComponent
		);
	}
}

const styles = StyleSheet.create({
	//Set up a style sheet to be used in the Navigators by using the "StyleSheet"'s method ".create"
	container: {
		//for the safe area view
		flex: 1,
	},
	drawerHeader: {
		backgroundColor: "#5637DD",
		height: 140,
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
		flexDirection: "row",
	},
	drawerHeaderText: {
		color: "#fff",
		fontSize: 24,
		fontWeight: "bold",
	},
	drawerImage: {
		margin: 10,
		height: 60,
		width: 60,
	},
	stackIcon: {
		marginLeft: 10,
		color: "#fff",
		fontSize: 24,
	},
});

export default connect(null, mapDispatchToProps)(Main);
//Connect the main component, but because we dont have a "mapStateToProps" function, well give the "connect" function "null" for the first argument and "mapDispatchToProps" as the second component. Completes the loop to get access to the action creators as "props"
