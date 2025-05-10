// backend/services/search-service/pitch-indexer.js
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: process.env.ES_HOST });

async function indexPitch(pitch) {
  await client.index({
    index: 'pitches',
    id: pitch.id,
    body: {
      title: pitch.title,
      description: pitch.description,
      tags: pitch.tags,
      location: {
        lat: pitch.location?.lat,
        lon: pitch.location?.lng
      }
    }
  });
}