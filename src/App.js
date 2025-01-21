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
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  getRandomScale() {
    return Math.random() * (1 - 1.2) + 1.2; // Range from 1 to 1.5
  }

  updateContent() {
    // Randomly select the next image and text
    const nextImageKey =
      this.imageKeys[Math.floor(Math.random() * this.imageKeys.length)];
    const nextImageNumber = this.getRandomInt(1, 11); // Random image number between 1 and 11 (exclusive of 11)
    const nextTextNumber = this.getRandomInt(0, TEXTS.length); // Random text index

    this.setState({
      currentImageKey: nextImageKey,
      currentImageNumber: nextImageNumber,
      specificTextNumber: nextTextNumber,
    });

    // Get the current text to be displayed
    const currentText = TEXTS[nextTextNumber]?.text || "";
    
    // Calculate the number of words in the text
    const wordCount = currentText.split(" ").length;
    
    // Calculate the display duration
    const minDisplayTime = 5000; // Minimum display time (5 seconds)
    const timePerWord = 500; // Additional time per word (500ms per word)
    const maxDisplayTime = 25000; // Maximum display time (25 seconds)
    const displayDuration = Math.min(maxDisplayTime, minDisplayTime + wordCount * timePerWord);

    // Log the display time for debugging
    console.log(`Text: "${currentText}"`);
    console.log(`Word count: ${wordCount}, Display time: ${displayDuration}ms`);

    // Clear the previous interval to avoid stacking
    clearTimeout(this.updateInterval);

    // Set a new interval based on the calculated display duration
    this.updateInterval = setTimeout(() => {
      this.updateContent(); // Update the text and image
    }, displayDuration);
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
        <div className="textContainer">
          <p>{specificText}</p>
        </div>
        <div className="imageContainer" onClick={() => this.goFullScreen()}>
          <img
            src={requestImageFile(`./${currentImageNumber}.gif`)}
            alt="art"
            style={{ transform: `scale(${scale})` }} // Apply random scale
          />
        </div>
      </div>
    );
  }
}

export default App;
