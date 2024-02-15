import React from "react";

const Choose = (props) => {
  return (
    <main>
      <div>
        <h1>Let's Get Started!</h1>
      </div>
      <div>
        <div className="flex-row justify-center justify-space-between-md align-stretch">
          <input
            onKeyPress={(e) =>
              e.key === "Enter" ? props.setUsername() : null
            }
            name="typing"
            placeholder="name"
            className="form-input col-12 col-md-9"
            value={props.typing}
            onChange={(e) =>
              props.changeHandler(e.target.name, e.target.value)
            }
          />
        </div>
        <span className="warning-message">
          {props.typing.length > 25 ? props.messageName : null}
        </span>
        <div className="flex-row justify-center justify-space-between-md align-stretch">
          <input
            name="typingRoom"
            placeholder="room"
            className="form-input col-12 col-md-9"
            onKeyPress={(e) =>
              e.key === "Enter" ? props.setUsername() : null
            }
            value={props.typingRoom}
            onChange={(e) =>
              props.changeHandler(e.target.name, e.target.value)
            }
          />
        </div>
        <span>
          {props.typingRoom.length > 25 ? props.messageRoom : null}
        </span>
        <div>
          <button
            className="btn col-12 col-md-3"
            onClick={() => props.setUsername()}
          >
            Join
          </button>
        </div>
        <div>
          <h2>Instructions: </h2>
          <p>
            Type your display name and a room name, if the room exists you
            will join it, if not it will be created for others to join. Anyone
            in the same room can draw together!
          </p>
        </div>
      </div>
    </main>
  );
};

export default Choose;
