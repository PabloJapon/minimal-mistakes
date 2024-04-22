---
title: "Checkout"
permalink: /checkout/
---

# Checkout

{% if page.plan %}
## Plan Seleccionado: {{ page.plan }}

<!-- Add form or payment processing logic here -->
{% else %}
<p>No se ha seleccionado ningún plan. Regresa a la <a href="/precios/">página de precios</a> para elegir un plan.</p>
{% endif %}
