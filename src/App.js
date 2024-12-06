import React, { Component } from "react";
import screenfull from "screenfull";
import "./App.css";
import TEXTS from "./processed_text_indians_audubon";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentImageNumber: 1, // Keep track of the currently displayed image
      currentImageKey: "mainImageNumber", // Keep track of the active image key
      specificTextNumber: 0, // Track the current text number
    };
    this.imageKeys = [
      "mainImageNumber",
      "secondImageNumber",
      "thirdImageNumber",
      "fourthImageNumber",
      "fifthImageNumber",
      "sixthImageNumber",
    ];
    this.updateInterval = null;
  }

  componentDidMount() {
    this.startUpdates();
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }

  startUpdates() {
    this.updateContent(); // Initial update for both image and text
    this.updateInterval = setInterval(() => {
      this.updateContent(); // Update both content types
    }, 7000); // Update every 7 seconds
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  getRandomScale() {
    return Math.random() * (0.7 - 0.3) + 0.3; // Range from 0.3 to 0.7
  }

  updateContent() {
    // Randomly select the next image and text
    const nextImageKey =
      this.imageKeys[Math.floor(Math.random() * this.imageKeys.length)];
    const nextImageNumber = this.getRandomInt(1, 3); // Random image number between 1 and 3
    const nextTextNumber = this.getRandomInt(0, TEXTS.length); // Random text index

    this.setState({
      currentImageKey: nextImageKey,
      currentImageNumber: nextImageNumber,
      specificTextNumber: nextTextNumber,
    });
  }

  goFullScreen() {
    screenfull.request();
  }

  render() {
    const { currentImageNumber, specificTextNumber } = this.state;
    const specificText = TEXTS[specificTextNumber]?.text || "No text available"; // Fallback in case of invalid index
    const requestImageFile = require.context("./images", true, /.gif$/);
    const scale = this.getRandomScale();

    return (
      <div className="App">
        <div className="contentContainer" onClick={() => this.goFullScreen()}>
          <div className="textContainer">
            <p>{specificText}</p>
          </div>
          <div className="imageContainer">
            <img
              src={requestImageFile(`./${currentImageNumber}.gif`)}
              alt="art"
              style={{ transform: `scale(${scale})` }} // Apply random scale
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
