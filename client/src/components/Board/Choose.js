import React, { Component } from "react";


export default class Choose extends Component {
	render() {
		return (
			<div className="login">
				<div>
					<div className="login-container">
						<div className="logo-container">	
						</div>
						<div>
							<div className="input-container">
								<input
									onKeyPress={(e) =>
										e.key === "Enter"
											? this.props.setUsername()
											: null
									}
									name="typing"
									placeholder="name"
									value={this.props.typing}
									onChange={(e) =>
										this.props.changeHandler(
											e.target.name,
											e.target.value
										)
									}
								/>
							</div>
							<span className="warning-message">
								{this.props.typing.length > 25
									? this.props.messageName
									: null}
							</span>

							<div className="submit-container">
								<button
									onClick={() => this.props.setUsername()}>
									Join
								</button>
							</div>
							<div className="instructions">
								<h2>Instructions: </h2>
								<p>
									Type your name and a room name, if the room
									exists you will join it, if not it will be
									created for others to join. Anyone in the
									same room can draw together!
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}