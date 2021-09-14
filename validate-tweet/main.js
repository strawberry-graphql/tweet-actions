module.exports = ({ core, twitter }) => {
  const tweetEncoded = process.env.TWEET;

  const buff = Buffer.from(tweetEncoded, "base64");
  const tweet = buff.toString("ascii");

  const result = twitter.parseTweet(tweet);

  if (!result.valid) {
    core.setFailed(`Tweet is not valid!`);
  }
};
