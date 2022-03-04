import DrawableCanvas from "../Canvas";
//import { Button } from "reactstrap";
import {SocketContext} from './context/socket';

const { Component } = require("react");
var canvas, context;

/* VARIABLES */
var drawing = false;
// determines the current x or y position
var current = {x: 0, y: 0};




export class Drawing extends Component {
  // this.context refers to socket.io making it available for all components
  static contextType = SocketContext;

  constructor(props) {
   super(props);
    this.state = {
      canvasWidth: 1400,
      canvasHeight: 1400,
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
    };
  }

  componentDidMount() {
    canvas = document.getElementsByName("canvas")[0].children[0].children[1];
    context = canvas.getContext("2d");
    this.context.on('drawing', data => this.onDrawingEvent(data))
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
    if(duplicate)
    {
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      context.lineWidth = brushRadius * 2;
      context.lineCap = 'round';
      context.lineJoin = 'round'
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
    return (
        <div
          name="canvas"
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMouseMove}
          onMouseLeave={() => drawing = false} // Determines if the mouse is outside the div
        >
          <DrawableCanvas
          />
        </div>
    );
  }
}

export default Drawing;