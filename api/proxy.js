exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const AT_TOKEN = 'patUKMoSH0FIHG2PS.1f17ea8095a5a6da8e69883e1e626983ff269ddfd55270ca25c0f293cde1023e';
  const AT_BASE  = 'appDBUXp7Qt3FSKGD';
  const AT_TABLE_VIS = 'tbld3K7NjvYJF9Hph';
  const AT_TABLE_POS = 'tblJjFW57Na2SXzO6';

  try {
    const data = JSON.parse(event.body);
    const tableId = data.quiz === 'vis' ? AT_TABLE_VIS : AT_TABLE_POS;

    let fields = {
      'Date'    : data.date,
      'Prénom'  : data.firstName,
      'Nom'     : data.lastName,
      'Email'   : data.email,
      'Résultat': data.summary,
    };

    if (data.quiz === 'vis') {
      const labels = ['Q1 — Source de recherche','Q2 — Clients via site/Google','Q3 — Résultat Google','Q4 — Trouvable en ligne','Q5 — Demandes par mois','Q6 — Page de contact claire','Q7 — Ce qui manque'];
      labels.forEach((l,i) => { if(data['q'+(i+1)]) fields[l] = data['q'+(i+1)]; });
    } else {
      const labels = ['Q1 — Présence actuelle','Q2 — Objectif web','Q3 — Cible','Q4 — Frein principal','Q5 — Délai souhaité','Q6 — Budget','Q7 — Attente prestataire','Q8 — Expérience passée'];
      labels.forEach((l,i) => { if(data['q'+(i+1)]) fields[l] = data['q'+(i+1)]; });
    }

    const res = await fetch(`https://api.airtable.com/v0/${AT_BASE}/${tableId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AT_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields })
    });

    const result = await res.json();

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(result)
    };

  } catch(err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.toString() })
    };
  }
};
