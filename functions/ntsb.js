const CAROL_URL = 'https://data.ntsb.gov/carol-main-public/api/Query/Main';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    // Build CAROL query from simple search params sent by the frontend
    const { query = '', limit = 50, dateFrom = '', dateTo = '' } = body;

    const rules = [];

    if (query.trim()) {
      rules.push({
        FieldName: 'narr_accp',
        InputValue: query.trim(),
        Operator: 'contains',
        FieldType: 'S',
        AndOr: 'AND',
        StartGroupCount: 0,
        EndGroupCount: 0,
      });
    }

    if (dateFrom) {
      rules.push({
        FieldName: 'ev_date',
        InputValue: dateFrom,
        Operator: '>=',
        FieldType: 'D',
        AndOr: 'AND',
        StartGroupCount: 0,
        EndGroupCount: 0,
      });
    }

    if (dateTo) {
      rules.push({
        FieldName: 'ev_date',
        InputValue: dateTo,
        Operator: '<=',
        FieldType: 'D',
        AndOr: 'AND',
        StartGroupCount: 0,
        EndGroupCount: 0,
      });
    }

    // Default: fetch recent accidents if no filters provided
    if (rules.length === 0) {
      rules.push({
        FieldName: 'ev_type',
        InputValue: 'ACC',
        Operator: '=',
        FieldType: 'S',
        AndOr: 'AND',
        StartGroupCount: 0,
        EndGroupCount: 0,
      });
    }

    const carolPayload = {
      QueryGroups: [{ QueryRules: rules, AndOr: 'AND' }],
      AndOr: 'AND',
      NumberOfRows: Math.min(limit, 200),
      SortColumn: 'ev_date',
      SortDescending: true,
    };

    const upstream = await fetch(CAROL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://data.ntsb.gov',
        'Referer': 'https://data.ntsb.gov/carol-main-public/',
        'User-Agent': 'Mozilla/5.0',
      },
      body: JSON.stringify(carolPayload),
    });

    const data = await upstream.json();

    if (data.Error) {
      // Return the raw error so we can debug, but still 200 so frontend can handle it
      return new Response(JSON.stringify({ error: data.Error, payload: carolPayload }), {
        status: 200,
        headers: CORS,
      });
    }

    return new Response(JSON.stringify(data), { status: 200, headers: CORS });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS });
  }
}
