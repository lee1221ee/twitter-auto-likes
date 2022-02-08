import { TwitterApi } from "twitter-api-v2"
import config from "./config.js"

const client = new TwitterApi({
  appKey: config.consumer_key,
  appSecret: config.consumer_secret,
  accessToken: config.access_token_key,
  accessSecret: config.access_token_secret
})

async function likesTweet(tweet) {
  await client.v2
    .like(config.user_id, tweet.id)
    .then(() => {
      return
    })
    .catch((error) => {
      throw new Error(
        "Too Many Requests, likes a Tweet has a user rate limit of 50 Requests per 15-minute"
      )
    })
}

for (const user of config.users) {
  let query = "from:" + user + " -is:retweet"
  const jsTweets = await client.v2.search(query)
  for (const tweet of jsTweets) {
    await likesTweet(tweet)
      .then(() => {
        let text = tweet.text.split("\n").join(" ").trim().substring(0, 100)
        console.log("[" + user + "] \u2764\uFE0F  " + text)
      })
      .catch((error) => {
        console.log(error)
        process.exit(0)
      })
  }
  console.log("----------------------------------------")
}
