export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  const apiKey = process.env.OPENCAGE_API_KEY;
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}&limit=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Geocoding failed' }, { status: 500 });
  }
}
