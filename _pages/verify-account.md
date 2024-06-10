---
title: "verify-account"
permalink: /verifyAccount/
layout: splash
---

<script>
  fetch('https://gastrali.netlify.app/.netlify/functions/verificar-sesion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ value: "Hello" })
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
</script>
