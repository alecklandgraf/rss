import fetch from 'node-fetch'

const FEED = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCLsiaNUb42gRAP7ewbJ0ecQ'

async function parseFeed(feed) {
  if (typeof feed !== 'string' || feed === '') {
    throw new Error('Feed must be a valid url (string)')
  }

  const data = await fetch(feed);
  const text = await data.text();
  console.log(text.split('\n').slice(0,5))

  // extract title via regex
  // const rxTitle = /<title>(.*)<\/title>/g;
  // const matches = [...text.matchAll(rxTitle)]
  // matches.forEach(match => console.log(match[1]))
  // console.log(matches.length)
}

parseFeed(FEED).then()
