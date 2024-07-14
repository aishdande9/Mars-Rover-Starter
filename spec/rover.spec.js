const Message = require("../message.js");
const Command = require("../command.js");
const Rover = require("../rover.js");
// 7 tests here!
describe("Rover class", function () {
  it("constructor sets position and default values for mode and generatorWatts", () => {
    const rover = new Rover(1264);
    expect(rover.position).toEqual(1264);
    expect(rover.mode).toEqual("NORMAL");
    expect(rover.generatorWatts).toEqual(110);
  });
  it("response returned by receiveMessage contains the name of the message", () => {
    let message = new Message("Test message is required", [
      new Command("STATUS_CHECK"),
      new Command("MODE_CHANGE", "LOW_POWER"),
    ]);
    let rover = new Rover(1264);
    let response = rover.receiveMessage(message);

    expect(response.message).toEqual("Test message is required");
  });
  it("response returned by receiveMessage includes two results if two commands are sent in the message", () => {
    const rover = new Rover(1264);
    const message = new Message("Test message is required", [
      new Command("STATUS_CHECK"),
      new Command("MODE_CHANGE", "LOW_POWER"),
    ]);
    let response = rover.receiveMessage(message);
    expect(response.message).toEqual("Test message is required");
    expect(response.results.length).toBe(2);
  });
  it("responds correctly to the status check command", () => {
    const rover = new Rover(1264);

    const commands = [
      new Command("MODE_CHANGE", "NORMAL"),
      new Command("STATUS_CHECK"),
    ];
    const message = new Message("Test message is required", commands);

    let response = rover.receiveMessage(message, commands);
    expect(response.message).toEqual("Test message is required");
    expect(response.results.length).toBe(2);

    expect(response.results[1].roverStatus.position).toEqual(1264);
    expect(response.results[1].roverStatus.mode).toEqual("NORMAL");
    expect(response.results[1].roverStatus.generatorWatts).toEqual(110);
  });
  it("responds correctly to the mode change command", () => {
    const rover = new Rover(1264);

    const commands = [
      new Command("MODE_CHANGE", "LOW_POWER"),
      new Command("STATUS_CHECK"),
    ];
    const message = new Message("Test message is required", commands);

    let response = rover.receiveMessage(message, commands);
    expect(response.message).toEqual("Test message is required");
    expect(response.results.length).toBe(2);
    expect(response.results[1].completed).toBeTruthy();
    expect(response.results[1].roverStatus.mode).toEqual("LOW_POWER");
  });
  it("responds with a false completed value when attempting to move in LOW_POWER mode", () => {
    const rover = new Rover(1264);
    const commands = [
      new Command("MODE_CHANGE", "LOW_POWER"),
      new Command("MOVE", 3579),
    ];
    const message = new Message("Test message is required", commands);

    let response = rover.receiveMessage(message, commands);
    expect(response.message).toEqual("Test message is required");
    expect(response.results.length).toBe(2);

    expect(response.results[1].completed).toBeFalsy();
  });
  it("responds with the position for the move command", () => {
    const rover = new Rover(1264);
    const commands = [new Command("MOVE", 3579), new Command("STATUS_CHECK")];
    const message = new Message("Test message is required", commands);

    let response = rover.receiveMessage(message, commands);
    expect(response.message).toEqual("Test message is required");

    expect(response.results[1].roverStatus.position).toEqual(3579);
    expect(response.results[1].completed).toBeTruthy();
  });
});

// Testing Rover test cases"

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.
