import React, { Component } from "react";


export default class Choose extends Component {
	render() {
		return (
			<div>
				<div>
					<div>
						<div>
							<h1>Let's Get Started!</h1>
						</div>
						<div>
							<div className="flex-row justify-center justify-space-between-md align-stretch">
								<input
									onKeyPress={(e) =>
										e.key === "Enter"
											? this.props.setUsername()
											: null
									}
									name="typing"
									placeholder="name"
									className="form-input col-12 col-md-9"
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
							<div className="flex-row justify-center justify-space-between-md align-stretch">
								<input
									name="typingRoom"
									placeholder="room"
									className="form-input col-12 col-md-9"
									onKeyPress={(e) =>
										e.key === "Enter"
											? this.props.setUsername()
											: null
									}
									value={this.props.typingRoom}
									onChange={(e) =>
										this.props.changeHandler(
											e.target.name,
											e.target.value
										)
									}
								/>
							</div>
							<span>
								{this.props.typingRoom.length > 25
									? this.props.messageRoom
									: null}
							</span>
							<div>
								<button
								className="btn col-12 col-md-3"
									onClick={() => this.props.setUsername()}>
									Join
								</button>
							</div>
							<div>
								<h2>Instructions: </h2>
								<p>
									Type your display name and a room name, if the room
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