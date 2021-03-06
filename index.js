const https = require("https");

function get(url) {
  const { hostname, pathname, search } = new URL(url);
  const options = {
    hostname,
    port: 443,
    path: `${pathname}${search}`
  };

  return new Promise((resolve, reject) => {
    const req = https.get(options, res => {
      let body = "";
      res.on("data", data => {
        body += data;
      });
      res.on("error", reject);
      res.on("end", () => resolve(body));
    });

    req.on("error", reject);
    req.end();
  });
}

function pad(str, indentation) {
  return str.padStart(str.length + indentation);
}

async function parseFeed(feedUrl) {
  if (typeof feedUrl !== "string" || feedUrl === "") {
    throw new Error("Feed must be a valid url (string)");
  }
  console.log(`Fetching feed for url: ${feedUrl}\n\n`);

  const text = await get(feedUrl);
  const lines = text.split("\n");

  const feed = {};

  let parent = feed;
  let lastToken = [];

  let indendation = 0;
  const DEFAULT_SPACES = 2;

  lines.forEach(line => {
    // todo: add /g to the regex: line.match(/<([\w:]+)/g) to capture things like <item> <title>NASA Pays Tribute, Says Goodbye to One of Agency’s Great Observatories</title>
    const [, token] = line.match(/<([\w:]+)/) || [];
    if (token) {
      if (token === "title") {
        console.log(
          pad(`${token} 👉 ${line.match(/<.*>(.*)<\/.*>/)[1]}`, indendation)
        );
      } else {
        console.log(pad(token, indendation));
      }
      if (line.endsWith(`/${token}>`) || line.endsWith("/>")) {
        // add context
      } else {
        lastToken.unshift(token);
        indendation += DEFAULT_SPACES;
      }
    } else if (line.match(`</${lastToken[0]}>`)) {
      indendation -= DEFAULT_SPACES;
      lastToken.shift();
    }
  });
}

const DEMO_FEED_URL =
  "https://www.youtube.com/feeds/videos.xml?channel_id=UCLsiaNUb42gRAP7ewbJ0ecQ";

parseFeed(process.argv[2] || DEMO_FEED_URL).then();

module.exports = parseFeed;
