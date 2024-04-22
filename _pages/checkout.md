---
title: "Checkout"
permalink: /checkout/
---

# Checkout

{% if page.plan %}
## Plan Seleccionado: {{ page.plan }}
{% else %}
<p>No se ha seleccionado ningún plan. Regresa a la <a href="/precios/">página de precios</a> para elegir un plan.</p>
{% endif %}

<script>
document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const plan = urlParams.get('plan');
  console.log('Plan selected:', plan);

  // Set the selected plan in the page metadata
  document.querySelector('h1').innerText += plan ? ` - ${plan}` : '';
});
</script>
