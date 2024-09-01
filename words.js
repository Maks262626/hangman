const words = ["sun", "tree", "cloud", "bird", "rain", "flower", "wind", "sea", "mountain", "star", "month", "river", "sand", "grass", "bea", "fish", "snow", "snowflake", "forest", "rock"];

export function getRandomWord() {
    let rndIndex = Math.floor(Math.random() * (words.length-1)); 
    return words[rndIndex];
}
  