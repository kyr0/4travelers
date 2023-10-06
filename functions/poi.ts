interface Env {
	KV: KVNamespace;
}

interface Poi {
  lat: number;
  lng: number;
  type: string;
  name: string;
}

// CORS OPTIONS request
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Max-Age': '86400',
    },
  });
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
	const value = await context.env.KV.get('poi');
 	return new Response(value, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const jsonData = await context.request.json() as Poi;
	await context.env.KV.put('poi', JSON.stringify(jsonData));
 	return new Response(JSON.stringify(jsonData), {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Max-Age': '86400',
    },
  });
}
