export async function onRequestPost(context) {
  try {
    const payload = await context.request.json();
    
    const webhookUrl = "https://api.osociohoteleiro.com.br/api/webhooks/automation/DvcHKhnDpAAn5xl_i6djPA?token=e7deae757125c78469b5da95c046d65f403ad733a776cbdd409fd6065a44cd28";
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    
    const responseText = await response.text();
    
    return new Response(JSON.stringify({ 
      status: "success", 
      crm_status: response.status,
      crm_response: responseText 
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      status: "error", 
      message: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
