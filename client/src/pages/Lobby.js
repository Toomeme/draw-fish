import React, { Component } from "react";
import Board from "../components/Board";
import Choose from "../components/Board/Choose";
import uuid from 'react-uuid';

class Lobby extends Component {

	constructor(props) {
		super(props);
		this.state = {
			username: "",
			typing: "",
			room: "",
			typingRoom: "",
			messageRoom: `The room name must be less than 25 character`,
			messageName: `The your name must be less than 25 character, try abbreviating`
		};
	}

	componentDidMount() {
		let deferredPrompt;

		window.addEventListener("beforeinstallprompt", (e) => {
			// Prevent Chrome 67 and earlier from automatically showing the prompt
			e.preventDefault();
			// Stash the event so it can be triggered later.
			deferredPrompt = e;
			// Update UI notify the user they can add to home screen
			deferredPrompt.prompt();
			// Wait for the user to respond to the prompt
			deferredPrompt.userChoice.then((choiceResult) => {
				if (choiceResult.outcome === "accepted") {
					console.log("User accepted the A2HS prompt");
				} else {
					console.log("User dismissed the A2HS prompt");
				}
				deferredPrompt = null;
			});
		});
	}


	changeHandler = (inputName, value) => {
		this.setState({
			[inputName]: value
		});
	};

	setUsername = () => {
		if (
			this.state.typing.length <= 25
		) {
			this.setState({
				username: this.state.typing || this.state.username,
				room: uuid()
			});
		}
	};

	clearRoom = () => {
		this.setState({
			username: "",
			room: "",
			typingRoom: "",
			typing: ""
		});
	};

	render() {
		return (
			<div className="Lobby">
				{this.state.username && this.state.room ? (
					<Board clearRoom={this.clearRoom} {...this.state} />
				) : (
					<Choose
						{...this.state}
						setUsername={this.setUsername}
						changeHandler={this.changeHandler}
					/>
				)}
			</div>
		);
	}
}

export default Lobby;