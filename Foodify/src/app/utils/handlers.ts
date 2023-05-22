const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const llm_secret = process.env.OPENAI_API_KEY;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const LYRICS_ENDPOINT = `https://spotify-lyric-api.herokuapp.com/?trackid=`;
const PLAYLISTS_ENDPOINT = 'https://api.spotify.com/v1/me/top/tracks?limit=3';

export async function getAccessToken(refresh_token: string) {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
      }),
    });
    return response.json();
  };

export const getTopTracks = async (refresh_token: string) => {
    const {access_token} = await getAccessToken(refresh_token);
    return fetch(PLAYLISTS_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
  };

export const getLyrics = async (song: string) => {
  const lyrics = await fetch(LYRICS_ENDPOINT + song);
  return lyrics.json();
}

export const fetchLLM = async (lyrics: string, name: string) => {
  const prompt = `
    Suggest me a food based off the mood and tone of these lyrics on JSON strictly:

    Input:${lyrics}
    Response (In JSON strictly, do not alter anything else about the format, only except where it says insert):
    {
      song: ${name}
      food: (insert food here) 
      reason: (insert reason here)
    }
    `;
  
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${llm_secret}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        max_tokens: 2048,
        temperature: 0.7,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      console.error(`Error: ${response.statusText}`);
      return;
    }

    const data = await response.json();
    const res = data.choices[0].message.content;
    return JSON.parse(res)

    } catch (err) {
    console.log(err);
  }
}


