import DrawableCanvas from "../Canvas";
import { FaSave,FaUndo,FaEraser } from "react-icons/fa";
import UserList from "./UserList";
import Auth from '../../utils/auth';
import React from "react";
import {SocketContext} from './context/socket';
import { Redirect } from 'react-router-dom';
const { Component } = require("react");


const loggedIn = Auth.loggedIn();
var canvas, context;

var fileID = '';

/* VARIABLES */
var drawing = false;
// determines the current x or y position
var current = {x: 0, y: 0};



function midPointBtw(p1, p2) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  };
};


export class Drawing extends Component {
  // this.context refers to socket.io making it available for all components
  static contextType = SocketContext;

  constructor(props) {
   super(props);
    this.state = {
      canvasWidth: 1000,
      canvasHeight: 500,
      brushColor: "#444",
      catenaryColor: "#0a0302",
      lazyRadius: 12,
      brushRadius: 10,
      clear: false,
      hideInterface: false,
      onChange: null,
      loadTimeOffset: 5,
      backgroundColor: "#FFF",
      hideGrid: false,
      disabled: false,
      saveData: "",
      immediateLoading: true,
      usingType: "draw",
      username: null,
      room: null,
      userList: [],
      submitted:false,
      redirect:false
    };
  }
  



  componentDidMount() {
    canvas = document.getElementsByName("canvas")[0].children[0].children[1];
    context = canvas.getContext("2d");
    this.whiteboard = React.createRef();
    this.context.on('drawing', data => this.onDrawingEvent(data))
      
    this.context.emit("join", {
      username: this.props.username,
      room: this.props.room
    });

    this.context.on("saved", saved =>{
      fileID = saved;
      this.setState({submitted:false,redirect:true});
    console.log(fileID)
  });
  
    this.context.on("joined", joined => {
      this.setState({
        id: joined.id,
        username: joined.username,
        room: joined.room
      });
      var canvasstate = this.saveableCanvas.getSaveData()
      this.context.emit("joinstate",{canvasstate})
    });

    this.context.on("joinstate",canvas =>{
      this.saveableCanvas.loadSaveData(canvas)});
  
    this.context.on("users", users => {
      this.setState({
        userList: users
      });
    });
  }

  

   onDrawingEvent(data) {
    this.drawLine(
      data.x0,
      data.y0,
      data.x1,
      data.y1,
      data.color,
      data.brushRadius,
      false,
      true,
    );
  }
  
  drawLine(x0, y0, x1, y1, color,brushRadius, emit,duplicate) {
    // Gets the offset so it fits to any window size
    var canvasTopPosition = document.getElementsByName("canvas")[0].offsetTop;
    var canvasLeftPosition = document.getElementsByName("canvas")[0].offsetLeft;
    // If Duplicate is false, it will draw on both monitors and cause duplication.
    let p1 = {x:x0,y:y0};
    let p2 = {x:x1,y:y1};
    if(duplicate)
    {
      context.beginPath();
      context.moveTo(x1, y1);
      var midPoint = midPointBtw(p1, p2);
      context.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
      context.lineTo(x0, y0);
      context.strokeStyle = color;
      context.lineWidth = brushRadius * 2;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.stroke();
      context.closePath();
    }
      if (!emit) {
        return;
      }
      this.context.emit('drawing', {
        x0: x0 - canvasLeftPosition,
        y0: y0 - canvasTopPosition,
        x1: x1 - canvasLeftPosition,
        y1: y1 - canvasTopPosition,
        color: color,
        brushRadius : this.state.brushRadius,
        room: this.state.room,
        type: this.state.usingType,
        globalCompositeOperation: context.globalCompositeOperation,
        message_type: "draw"
      });   
  }
  onMouseDown = (e) => {
    drawing = true;
    current.x = e.clientX || e.touches[0].clientX;
    current.y = e.clientY || e.touches[0].clientY;
  };

  onMouseUp = (e) => {
    if (!drawing) {
      return;
    }
    drawing = false;
    this.drawLine(
      current.x,
      current.y,
      e.clientX,
      e.clientY,
      this.state.brushColor,
      this.state.brushRadius,
      true,
      false,
    );
  };
  onMouseMove = (e) => {
    if (!drawing) {
      return;
    }
      this.drawLine(current.x, current.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY,this.state.brushColor,this.state.brushRadius,true,false);      
      current.x = e.clientX || e.touches[0].clientX;
      current.y = e.clientY || e.touches[0].clientY;
  };


  render() {
    if (this.state.redirect){
      return <Redirect push to={'/submit/'+ this.state.room + fileID}/>;
    }
    if (this.state.submitted){
      return <div className="justify-center">Loading...</div>
    }

    return (

        <main>
      
        <div
          name="canvas"
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMouseMove}
          onMouseLeave={() => drawing = false} // Determines if the mouse is outside the div
        >
          <DrawableCanvas ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
          brushColor={this.state.brushColor}
          brushRadius={this.state.brushRadius}
          lazyRadius={this.state.lazyRadius}
          canvasWidth={this.state.width}
          canvasHeight={this.state.height}
          />
          </div>
          <div className='tools ml-3'>
          <button
          data-aos="fade-left"
          className="btn col-auto col-md-3"
            onClick={() => {
              localStorage.setItem(
                "savedDrawing",
                this.saveableCanvas.getSaveData()
              );
            }}
          >
            <FaSave />
          </button>
          <button
          data-aos="fade-left"
          className="btn col-auto col-md-3"
            onClick={() => {
              this.saveableCanvas.eraseAll();
            }}
          >
            <FaEraser />
          </button>
          <button
          data-aos="fade-left"
          className="btn col-auto col-md-3"
            onClick={() => {
              this.saveableCanvas.undo();
            }}
          >
            <FaUndo />
          </button>
          <div data-aos="fade-left">
          <label>Color:</label>
            <input
              type="color"
              value={this.state.brushColor}
              onChange={e =>
                this.setState({ brushColor: e.target.value })
              }
            />
          </div>

          <div data-aos="fade-left">
            <label>Radius:</label>
            <input
              type="number"
              value={this.state.brushRadius}
              onChange={e =>
                this.setState({ brushRadius: parseInt(e.target.value, 10) })
              }
            />
          </div>
          <div data-aos="fade-left">
            <label>Stabilization:</label>
            <input
              type="number"
              value={this.state.lazyRadius}
              onChange={e =>
                this.setState({ lazyRadius: parseInt(e.target.value, 10) })
              }
            />       
            <button
            className="btn col-12 col-md-3"
            onClick={ () => {
              if (loggedIn){
              var image = this.saveableCanvas.getDataURL();
              this.context.emit('image', {image:image,
                room: this.state.room, message_type: "image"});
              this.setState({submitted: true})
              }
            }}
          >
          Publish!
          </button>
          </div>

        </div>
          <div className="user-list" data-aos="fade-right">
          <h3>Room:</h3>
          <h5>{this.state.room}</h5>
          <br></br>
          <h3>Users:</h3>
           <UserList userList={this.state.userList} />
          </div>
        
        </main>
        
    );
  }
}

export default Drawing;