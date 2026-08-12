export async function onRequestPost(context) {
  try {
    const payload = await context.request.json();
    
    // Novo webhook do CRM do cliente
    const webhookUrl = "https://api.osociohoteleiro.com.br/api/webhooks/automation/EfBvoK_uRnwx0GwAthCK1w?token=31812d725ec7b8d0bab18237ebd941f9eeef1788a9bbd03e44aca23bb7561135";
    
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
