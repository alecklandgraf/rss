import fetch from "node-fetch";

const FEED =
  "https://www.youtube.com/feeds/videos.xml?channel_id=UCLsiaNUb42gRAP7ewbJ0ecQ";

function pad(str, indentation) {
  return str.padStart(str.length + indentation);
}

async function parseFeed(feedUrl) {
  if (typeof feedUrl !== "string" || feedUrl === "") {
    throw new Error("Feed must be a valid url (string)");
  }
  console.log(`Fetching feed for url: ${feedUrl}\n\n`);

  const data = await fetch(feedUrl);
  // future optimization to use the body ReadableStream and use less mem
  const text = await data.text();
  const lines = text.split("\n");

  const feed = {};

  let parent = feed;
  let lastToken = [];

  let indendation = 0;
  const DEFAULT_SPACES = 2;

  lines.splice(0, 150).forEach(line => {
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

parseFeed(FEED).then();
