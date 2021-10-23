import React, { Component } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { Input, CheckBox, Button, Icon } from "react-native-elements";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { baseUrl } from "../shared/baseUrl";
import * as ImageManipulator from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";

class LoginTab extends Component {
	//Renamed from "Login" to "LoginTab" in order to implement the bottom tab navigator from react-navigation-tabs

	constructor(props) {
		super(props);

		this.state = {
			//Use the component state to temporarly hold a username and password
			username: "",
			password: "",
			remember: false,
		};
	}

	static navigationOptions = {
		title: "Login",
		tabBarIcon: (
			{ tintColor } //added for bottom tab navigator. Set to a function to which we pass the tint color. THis funciton automatically receives "tintColor" as an argument from the bottomtabnavigator component which we will create and define the tint colors for. Will return an <Icon> component as seen below.
		) => (
			<Icon
				name="sign-in"
				type="font-awesome"
				iconStyle={{ color: tintColor }}
			/>
		),
	};

	handleLogin() {
		console.log(JSON.stringify(this.state));
		if (this.state.remember) {
			//If remember me checkbox is checked, save the username and password to the secure store
			SecureStore.setItemAsync(
				"userinfo", //first argument, this is the key
				JSON.stringify({
					//Want to store the username and password, but must be converted to a JSON string before it can be stored. So use JSON.stringify on an object containing the username and password taken from the component's state.
					username: this.state.username,
					password: this.state.password,
				})
			).catch((error) => console.log("Could not save user info", error)); //All SecureStore methods return a promise that will reject if there is an error. Check for a rejected promise by adding this ".catch" block. An error will automatically passed in as an argument, so it can be logged to the console in this manner.
		} else {
			//Also want to handle the case for if the remember me checkbox is not checked, in which case, we want to delete any user info in the secure store.
			SecureStore.deleteItemAsync("userinfo").catch(
				//will delete any data stored under the key "userinfo" if there no data, nothing will happen.  If there is data, it will get deleted and a promise will be returned.  Can check for a rejected promise by adding the ".catch" block
				(error) => console.log("Could not delete user info", error)
			);
		}
	}

	componentDidMount() {
		//Ensure that the user info is retrieved from the secure store when the component mounts. Use the "componentDidMount()" lifecycle method (built into React and React Native). Since the user info gets deleted from the store if the remeber me check box is unchecked when the form is submitted that means that if ther is any user info in the store we can deduce that the remember me check box was checked the last time the form was submitted. Therefore, use the "getItemAsync" method to check if there is any data saved under the key "userinfo"
		SecureStore.getItemAsync("userinfo") //Check if there is any data saved under the key "userinfo".  Will returen a promise that, if it resolves, will return the value stored under the key.  That means we can access the value using the JS ".then" method.
			.then((userdata) => {
				//"userdata" is just an intermediate variable name that should contain the JSON string with the username and password
				const userinfo = JSON.parse(userdata); //Must change the JSON string back to a JS object using "JSON.parse" method and store it inside a variable called "userinfo"
				if (userinfo) {
					//check to make sure that the "userinfo" variable actually contains a non null, truthy value.  If so update the login component state with the username and password from the "userinfo" object.
					this.setState({ username: userinfo.username });
					this.setState({ password: userinfo.password });
					this.setState({ remember: true }); //We know that if there was a username and password saved to the secure store, that means that the last tiem the form was submitted, the remember me checkbox was checked. Because otherwise, the username and password would have been deleted from the secure stoer, so we can logically deduce that the remember me checkbox should be set to true.
				}
			});
	}

	render() {
		return (
			<View style={styles.container}>
				<Input
					placeholder="Username"
					leftIcon={{ type: "font-awesome", name: "user-o" }}
					onChangeText={(username) => this.setState({ username })} //whenever the text in the input changes, the state will get updated
					value={this.state.username} //set the value so that it always reflects the state (which makes it a controlled component)
					containerStyle={styles.formInput}
					leftIconContainerStyle={styles.formIcon}
				/>
				<Input
					placeholder="Password"
					leftIcon={{ type: "font-awesome", name: "key" }}
					onChangeText={(password) => this.setState({ password })}
					value={this.state.password}
					containerStyle={styles.formInput}
					leftIconContainerStyle={styles.formIcon}
				/>
				<CheckBox
					title="Remember Me" //checkbox requires a title
					center //centers the check box
					checked={this.state.remember} //control whether or not it is checked by setting this property to the state value of "remember"
					onPress={() =>
						this.setState({ remember: !this.state.remember })
					}
					containerStyle={styles.formCheckbox}
				/>
				<View style={styles.formButton}>
					<Button
						onPress={() => this.handleLogin()}
						title="Login"
						icon={
							<Icon
								name="sign-in"
								type="font-awesome"
								color="#fff"
								iconStyle={{ marginRight: 10 }}
							/>
						}
						buttonStyle={{ backgroundColor: "#5637DD" }}
					/>
				</View>
				<View style={styles.formButton}>
					<Button
						onPress={() =>
							this.props.navigation.navigate("Register")
						} //Want button to route to the register screen which can be done using the navigation props ".navigate" function. When using the ".navigate" funcion from the Navigation Props, could destructure as done before, or do in the way written in this line.
						title="Register"
						type="clear" //Make it a transparent button without a background color of its own
						icon={
							<Icon
								name="user-plus"
								type="font-awesome"
								color="blue"
								iconStyle={{ marginRight: 10 }}
							/>
						}
						titleStyle={{ color: "blue" }} //Affects the text color of the title
					/>
				</View>
			</View>
		);
	}
}

class RegisterTab extends Component {
	//Creating the RegisterTab component.

	constructor(props) {
		super(props);

		this.state = {
			//Constructor and state needed because the form for RegisterTab will be a controlled form, where the data is stored within the component's state
			username: "",
			password: "",
			firstname: "",
			lastname: "",
			email: "",
			remember: false,
			imageUrl: baseUrl + "images/logo.png", //Initialize image as the logo
		};
	}

	static navigationOptions = {
		//Copied from the "LoginTab" component
		title: "Register",
		tabBarIcon: ({ tintColor }) => (
			<Icon
				name="user-plus"
				type="font-awesome"
				iconStyle={{ color: tintColor }}
			/>
		),
	};

	getImageFromCamera = async () => {
		//Set up as an arrow function so that the corresponding <Button>'s on press can be written cleanly like this: "onPress={this.getImageFromCamera}". Set up as an "async" method so we can use "await" inside of it so we can handle promises.
		//Before using the camera, need to get permissions to use camera and read/write to cameraRoll.
		const cameraPermission = await Permissions.askAsync(Permissions.CAMERA); //Put the first permission inside a vairable called "cameraPermission". Inside it, await the resolve value of a promise from "Premission.askAsync" for "Premissions.CAMERA". This will allow us to use the camera.
		const cameraRollPermission = await Permissions.askAsync(
			Permissions.CAMERA_ROLL
		); //Put the second permission inside a vairable called "cameraRollPermission". Inside it, await the resolve value of a promise from "Permissions.askAsync" for "Permissions.CAMERA_ROLL". This will allow us to read from and write to the cameraRoll.

		//Only want to go ahead with using the imagePicker API if we get permissions for both Camera and CameraRoll. Use an 'if' statement to check for this.
		if (
			cameraPermission.status === "granted" &&
			cameraRollPermission.status === "granted"
		) {
			//when the promise returns from the "Permissions.askAsync" method, it resolves into an object that contains a "status" property which will be granted if the request was successful. 'if' condition will check if the "cameraPermission.status" and "cameraRollPermission.status" variables we created contains the status that is equal to the string 'granted'.
			const capturedImage = await ImagePicker.launchCameraAsync({
				//if permissions were granted, set up a variable that will ultimately hold the local uri (the local filepath of the captured image).  THis is the value that will be resolved from the promise returned from "ImagePicker.launchCameraAsync". This method takes a single argument, an object with option configurations.
				allowsEditing: true, //After photo is taken, an editor screen will come up
				aspect: [1, 1], //Means the aspect ratio will be forced to be 1 to 1
			});
			if (!capturedImage.cancelled) {
				//Make sure the image picking process was not cancelled.
				console.log(capturedImage); //Console log the object that was returned.
				this.processImage(capturedImage.uri); //BEFORE ADDING "processImage" function this line did: Set the "imageUrl" state to the captured image's uri property
			}
		}
	};

	processImage = async (imgUri) => {
		const processedImage = await ImageManipulator.manipulateAsync(
			imgUri,
			[{ resize: { width: 400 } }],
			{ format: "png" }
		);
		console.log(processedImage);
		this.setState({ imageUrl: processedImage.uri });
	};

	getImageFromGallery = async () => {
		const cameraRollPermission = await Permissions.askAsync(
			Permissions.CAMERA_ROLL
		);
		if (cameraRollPermission.status === "granted") {
			const capturedImage = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				aspect: [1, 1],
			});
			if (!capturedImage.cancelled) {
				console.log(capturedImage);
				this.processImage(capturedImage.uri);
				MediaLibrary.saveToLibraryAsync(capturedImage.uri);
			}
		}
	};

	handleRegister() {
		//Function to handle the form submission. Since there is no back end, this method/function will console log the input information. If the remember checkbox is picked, it will add the input information to the SecureStore. Copied from the "handleLogin" method/funciton and name just changed to "handleRegister"
		console.log(JSON.stringify(this.state));
		if (this.state.remember) {
			SecureStore.setItemAsync(
				"userinfo",
				JSON.stringify({
					username: this.state.username,
					password: this.state.password,
				})
			).catch((error) => console.log("Could not save user info", error));
		} else {
			SecureStore.deleteItemAsync("userinfo").catch((error) =>
				console.log("Could not delete user info", error)
			);
		}
	}

	render() {
		return (
			//Create the register form as a controlled form where the information is saved in the component's state. Copied from "loginTab"'s form.
			<ScrollView>
				<View style={styles.container}>
					<View style={styles.imageContainer}>
						<Image //Image component that will be the profile photo at the top of the register tab. It will start as the nucamp logo, then will be replaced with a camera image once a photo has been taken
							source={{ uri: this.state.imageUrl }} //The image component will initialized to retrieve the logo image served from JSON server as it's sorce
							loadingIndicatorSource={require("./images/logo.png")} //Built in prop, give a local image file path (not from a server) from the client side files. Will be displayed incase it takes some time to load an image from the server.
							style={styles.image}
						/>
						<Button //Added for taking a picture
							title="Camera"
							onPress={this.getImageFromCamera} //Give "onPress" built in property the method "this.getImageFromCamera" which we created. Just giving the name of the method and not wrapping it inside an arrow function, and not calling it by placing a parameter list after the function name.  When we don't pass any argument to the event handler like this, it is an improved way of adding the method to the "onPress" prop, but doing this will require the method to be written as an arrow function OR regular function with the bind method used.
						/>
						<Button
							title="Gallery"
							onPress={this.getImageFromGallery}
						/>
					</View>
					<Input
						placeholder="Username"
						leftIcon={{ type: "font-awesome", name: "user-o" }}
						onChangeText={(username) => this.setState({ username })}
						value={this.state.username}
						containerStyle={styles.formInput}
						leftIconContainerStyle={styles.formIcon}
					/>
					<Input
						placeholder="Password"
						leftIcon={{ type: "font-awesome", name: "key" }}
						onChangeText={(password) => this.setState({ password })}
						value={this.state.password}
						containerStyle={styles.formInput}
						leftIconContainerStyle={styles.formIcon}
					/>
					<Input
						placeholder="First Name"
						leftIcon={{ type: "font-awesome", name: "user-o" }}
						onChangeText={(firstname) =>
							this.setState({ firstname })
						}
						value={this.state.firstname}
						containerStyle={styles.formInput}
						leftIconContainerStyle={styles.formIcon}
					/>
					<Input
						placeholder="Last Name"
						leftIcon={{ type: "font-awesome", name: "user-o" }}
						onChangeText={(lastname) => this.setState({ lastname })}
						value={this.state.lastname}
						containerStyle={styles.formInput}
						leftIconContainerStyle={styles.formIcon}
					/>
					<Input
						placeholder="Email"
						leftIcon={{ type: "font-awesome", name: "envelope-o" }}
						onChangeText={(email) => this.setState({ email })}
						value={this.state.email}
						containerStyle={styles.formInput}
						leftIconContainerStyle={styles.formIcon}
					/>
					<CheckBox
						title="Remember Me"
						center
						checked={this.state.remember}
						onPress={() =>
							this.setState({ remember: !this.state.remember })
						}
						containerStyle={styles.formCheckbox}
					/>
					<View style={styles.formButton}>
						<Button
							onPress={() => this.handleRegister()}
							title="Register"
							icon={
								<Icon
									name="user-plus"
									type="font-awesome"
									color="#fff"
									iconStyle={{ marginRight: 10 }}
								/>
							}
							buttonStyle={{ backgroundColor: "#5637DD" }}
						/>
					</View>
				</View>
			</ScrollView>
		);
	}
}

const Login = createBottomTabNavigator(
	//Constant called "Login" set to 'react-navigation-tabs' "createBottomTabNavigator" function. Pass it the arguments 2 objects: a list of tabs for the navigator, 2nd for extra options.
	{
		//1st argument of the list of tabs for the navigator
		Login: LoginTab,
		Register: RegisterTab,
	},
	{
		//Optional 2nd argument
		tabBarOptions: {
			//Colors for the tab bar at the bottom of the screen and other formatting options
			activeBackgroundColor: "#5637DD",
			inactiveBackgroundColor: "#CEC8FF",
			activeTintColor: "#fff",
			inactiveTintColor: "#808080",
			labelStyle: { fontSize: 16 },
		},
	}
);

const styles = StyleSheet.create({
	//required to pass in an object that contains all the styles you are using
	container: {
		justifyContent: "center",
		margin: 10,
	},
	formIcon: {
		marginRight: 10,
	},
	formInput: {
		padding: 2,
	},
	formCheckbox: {
		margin: 2.5,
		backgroundColor: null,
	},
	formButton: {
		margin: 5,
		marginRight: 40,
		marginLeft: 40,
	},
	imageContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-evenly",
		margin: 10,
	},
	image: {
		width: 60,
		height: 60,
	},
});

export default Login;
