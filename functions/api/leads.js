export async function onRequestPost(context) {
  try {
    const payload = await context.request.json();
    
    const webhookUrl = "https://script.google.com/macros/s/AKfycbyFamaHxck4zAISU0qMrL-qc-8WAB5lBNVI4nxHTpaVkVHiiP5BoKDXXQB97h_Nxqg2/exec";
    
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
