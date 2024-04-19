const options = {  
    headers: {    
      Authorization: `Bearer ${accessToken}`,    
      "X-Noroff-API-Key": apiKey.data.key  
    }} 
    const response = await fetch(`${NOROFF_API_URL}/social/posts`, options)
    const data = await response.json()