import DrawableCanvas from "../Canvas";
import { FaSave, FaUndo, FaEraser } from "react-icons/fa";
import UserList from "./UserList";
import Auth from '../../utils/auth';
import React, { useState, useEffect, useContext, useRef } from "react";
import { SocketContext } from './context/socket';
import { Redirect } from 'react-router-dom';

const Drawing = (props) => {
  const [drawing, setDrawing] = useState(false);
  const [current, setCurrent] = useState({ x: 0, y: 0 });
  const [fileID, setFileID] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [canvas, setCanvas] = useState(null);
  const [context, setContext] = useState(null);
  const socket = useContext(SocketContext);
  const canvasRef = useRef(null);

  const loggedIn = Auth.loggedIn();

  useEffect(() => {
    if (canvasRef.current) {
      setCanvas(canvasRef.current.children[0].children[1]);
      setContext(canvasRef.current.children[0].children[1].getContext("2d"));
    }
  }, [canvasRef]);

  useEffect(() => {
    if (context) {
      socket.on('drawing', data => onDrawingEvent(data));
      socket.emit("join", {
        username: props.username,
        room: props.room
      });

      socket.on("saved", saved => {
        setFileID(saved);
        setSubmitted(false);
        setRedirect(true);
      });

      socket.on("joined", joined => {
        setSubmitted(false);
        setRedirect(false);
        setRoom(joined.room);
        var canvasstate = saveableCanvas.getSaveData();
        socket.emit("joinstate", { canvasstate });
      });

      socket.on("joinstate", canvas => {
        saveableCanvas.loadSaveData(canvas)
      });

      socket.on("users", users => {
        setUserList(users);
      });
    }
  }, [context, props.username, props.room, socket]);

  const onDrawingEvent = (data) => {
    drawLine(
      data.x0,
      data.y0,
      data.x1,
      data.y1,
      data.color,
      data.brushRadius,
      false,
      true,
    );
  };

  const drawLine = (x0, y0, x1, y1, color, brushRadius, emit, duplicate) => {
    // hard code offset since canvas size is fixed.
    var canvasTopPosition = 125;
    var canvasLeftPosition = 97;

    if (duplicate) {
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      context.lineWidth = brushRadius * 2;
      context.lineCap = 'round';
      context.stroke();
      context.closePath();
    }
    if (!emit) {
      return;
    }
    socket.emit('drawing', {
      x0: x0 - canvasLeftPosition,
      y0: y0 - canvasTopPosition,
      x1: x1 - canvasLeftPosition,
      y1: y1 - canvasTopPosition,
      color: color,
      brushRadius: brushRadius,
      room: props.room,
      type: state.usingType,
      globalCompositeOperation: context.globalCompositeOperation,
      message_type: "draw"
    });
  };

  const onMouseDown = (e) => {
    setDrawing(true);
    setCurrent({ x: e.clientX || e.touches[0].clientX, y: e.clientY || e.touches[0].clientY });
  };

  const onMouseUp = (e) => {
    if (!drawing) {
      return;
    }
    setDrawing(false);
    drawLine(
      current.x,
      current.y,
      e.clientX,
      e.clientY,
      state.brushColor,
      state.brushRadius,
      true,
      false,
    );
  };

  const onMouseMove = (e) => {
    if (!drawing) {
      return;
    }
    drawLine(
      current.x,
      current.y,
      e.clientX || e.touches[0].clientX,
      e.clientY || e.touches[0].clientY,
      state.brushColor,
      state.brushRadius,
      true,
      false,
    );
    setCurrent({ x: e.clientX || e.touches[0].clientX, y: e.clientY || e.touches[0].clientY });
  };

  if (redirect) {
    return <Redirect push to={'/submit/' + props.room + fileID} />;
  }
  if (submitted) {
    return <div className="justify-center">Loading...</div>;
  }

  return (
    <main>
      <div
        name="canvas"
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseLeave={() => setDrawing(false)}
        ref={canvasRef}
      >
        <DrawableCanvas
          ref={canvasDraw => (saveableCanvas = canvasDraw)}
          brushColor={state.brushColor}
          brushRadius={state.brushRadius}
          lazyRadius={state.lazyRadius}
          canvasWidth={state.canvasWidth}
          canvasHeight={state.canvasHeight}
        />
      </div>
      <div className='tools ml-3'>
        <button
          data-aos="fade-left"
          className="btn col-auto col-md-3"
          onClick={() => {
            localStorage.setItem(
              "savedDrawing",
              saveableCanvas.getSaveData()
            );
          }}
        >
          <FaSave />
        </button>
        <button
          data-aos="fade-left"
          className="btn col-auto col-md-3"
          onClick={() => {
            saveableCanvas.eraseAll();
          }}
        >
          <FaEraser />
        </button>
        <button
          data-aos="fade-left"
          className="btn col-auto col-md-3"
          onClick={() => {
            saveableCanvas.undo();
          }}
        >
          <FaUndo />
        </button>
        <div data-aos="fade-left">
          <label>Color:</label>
          <input
            type="color"
            value={state.brushColor}
            onChange={e =>
              setState({ ...state, brushColor: e.target.value })
            }
          />
        </div>

        <div data-aos="fade-left">
          <label>Radius:</label>
          <input
            type="number"
            value={state.brushRadius}
            onChange={e =>
              setState({ ...state, brushRadius: parseInt(e.target.value, 10) })
            }
          />
        </div>
        <div data-aos="fade-left">
          <label>Stabilization:</label>
          <input
            type="number"
            value={state.lazyRadius}
            onChange={e =>
              setState({ ...state, lazyRadius: parseInt(e.target.value, 10) })
            }
          />
          <button
            className="btn col-12 col-md-3"
            onClick={() => {
              if (loggedIn) {
                var image = saveableCanvas.getDataURL();
                socket.emit('image', {
                  image: image,
                  room: state.room,
                  message_type: "image"
                });
                setSubmitted(true);
              }
            }}
          >
            Publish!
          </button>
        </div>
      </div>
      <div className="user-list" data-aos="fade-right">
        <h3>Room:</h3>
        <h5>{state.room}</h5>
        <br></br>
        <h3>Users:</h3>
        <UserList userList={state.userList} />
      </div>
    </main>
  );
};

export default Drawing;
