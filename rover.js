const Message = require("./message.js");
const Command = require("./command.js");
class Rover {
  // Write code here!
  constructor(position) {
    this.position = position;
    this.mode = "NORMAL";
    this.generatorWatts = 110;
  }

  receiveMessage(message) {
    const response = { message: message.name };
    const result = [];
    for (let i = 0; i < message.commands.length; i++) {
      if (message.commands[i].commandType === "STATUS_CHECK") {
        const roverStatus = {
          position: this.position,
          mode: this.mode,
          generatorWatts: this.generatorWatts,
        };
        result.push({ completed: true, roverStatus });
      } else if (message.commands[i].commandType === "MODE_CHANGE") {
        result.push({ completed: true });
        this.mode = message.commands[i].value;
        //console.log(this.mode);
      } else if (message.commands[i].commandType === "MOVE") {
        if (this.mode === "NORMAL") {
          this.position = message.commands[i].value;
          result.push({ completed: true });
        } else {
          result.push({ completed: false });
        }
      } else {
        result.push({ completed: false });
      }
    }
    response.results = result;
    return response;
  }
}

let commands = [
  new Command("STATUS_CHECK"),
  new Command("MOVE", 4321),
  new Command("STATUS_CHECK"),
  new Command("MODE_CHANGE", "LOW_POWER"),
  new Command("MOVE", 3579),
  new Command("STATUS_CHECK"),
];
let message = new Message("Test message with two commands", commands);
let rover = new Rover(98382); // Passes 98382 as the rover's position.
let response = rover.receiveMessage(message);

console.log(response);
module.exports = Rover;
