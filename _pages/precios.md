---
permalink: /planes/
layout: default
---

<h1 style="margin-top: 5em; text-align: center;">Elige tu plan ideal</h1>
<p style="text-align: center; color: #666; margin-top: 0.5em;">Sin permanencia. Cancela cuando quieras.</p>

<style>
img {
  float: right;
  margin: 10px 0 10px 10px;
}

.plan-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.plan {
  width: 380px;
  padding: 60px 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
  text-align: center;
  margin: 60px 14px;
}

.plan-button, .plan-button2 {
  background-color: #6699ff;
  color: white;
  border: none;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  border-radius: 5px;
  cursor: pointer;
}

.plan-button {
  padding: 15px 80px;
  font-size: 20px;
  margin: 30px;
}

.plan-button2 {
  padding: 10px 50px;
  font-size: 16px;
}

.plan-button:hover, .plan-button2:hover {
  background-color: #4c80d9;
}

.plan .tick-icon {
  display: inline-block;
  width: 26px;
  height: 26px;
  background-color: #6699ff;
  mask: url('/assets/images/done.png') no-repeat center / contain;
}

.plan .tick-icon-yellow {
  display: inline-block;
  width: 26px;
  height: 26px;
  background-color: #ffc368;
  mask: url('/assets/images/done.png') no-repeat center / contain;
}

.fancy-label {
  width: 150px; 
  margin: 0;
  padding: 0;
  text-align: left;
  float: none;
}

.item-container {
  display: flex;
  align-items: center;
  margin: 0.5em 2em;
}

.item-container p {
  margin: 0;
  padding-left: 10px;
}

.plan-container .plan:nth-child(1) {
  border-color: #6699ff;
}

.plan-container .plan:nth-child(2) {
  border-color: #ffc368;
}

.plan-container .plan:nth-child(3) {
  border-color: #081655;
  background: #081655;
}

.plan-container .plan:nth-child(3) h2, 
.plan-container .plan:nth-child(3) h1, 
.plan-container .plan:nth-child(3) p {
  color: white;
}

.plan-container .plan:nth-child(3) .plan-button {
  background-color: #ffc368;
}

.plan-price-note {
  font-size: 13px;
  color: #888;
  margin-top: -10px;
  margin-bottom: 10px;
}

.plan-container .plan:nth-child(3) .plan-price-note {
  color: #aaa;
}

.table-container {
  margin-top: 60px;
}

.table-container table {
  border-collapse: collapse;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.table-container td, 
.table-container th {
  padding: 8px;
}

.table-container td {
  border: 1px solid #ccc;
  text-align: left;
}

.table-container thead th {
  background-color: transparent !important;
  border: none;
}

.table-container tbody tr:nth-child(even) {
  background-color: #e0e0e0;
}

.table-container th:first-child, 
.table-container td:first-child {
  border-left: none;
}

.table-container th:last-child, 
.table-container td:last-child {
  border-right: none;
}

.table-container tr:last-child th, 
.table-container tr:last-child td {
  border-bottom: none;
}

.table-container tr:first-child th, 
.table-container tr:first-child td {
  border-top: none;
}

.table-container tr:nth-child(2) th, 
.table-container tr:nth-child(2) td {
  border-top: none;
}
</style>

<div class="plan-container">

  <!-- PLAN GRATIS -->
  <div class="plan" style="padding-top: 4.7em;">
    <h2 style="margin-bottom: 0.3em;">Gratis</h2>
    <p id="plan-current-gratis" class="plan-current-text"></p>
    <h1 style="font-weight: normal;">0€</h1>
    <p class="plan-price-note">Para siempre</p>
    <button class="plan-button" onclick="location.href='/payment_form/?plan=Gratis'">Empieza</button>
    <div class="item-container"><span class="tick-icon"></span><p>TPV completo</p></div>
    <div class="item-container"><span class="tick-icon"></span><p>App cocina</p></div>
    <div class="item-container"><span class="tick-icon"></span><p>App camareros</p></div>
    <div class="item-container"><span class="tick-icon"></span><p>App cliente (pedidos y pago)</p></div>
    <div class="item-container"><span class="tick-icon"></span><p>Panel propietario básico</p></div>
    <div class="item-container"><span class="tick-icon"></span><p>Dispositivos ilimitados</p></div>
    <div class="item-container"><span class="tick-icon"></span><p>Con nuestra marca en las apps</p></div>
    <div class="item-container" style="opacity:0.4;"><span class="tick-icon"></span><p>Sin fotos en el menú</p></div>
    <div class="item-container" style="opacity:0.4;"><span class="tick-icon"></span><p>Sin estadísticas</p></div>
    <div class="item-container" style="opacity:0.4;"><span class="tick-icon"></span><p>Sin soporte</p></div>
    <p style="margin-top: 1.5em; font-size: 13px; color: #888;">1,5% de comisión por transacción</p>
  </div>

  <!-- PLAN PRO -->
  <div class="plan" style="padding: 0px 20px;">
    <p style="background-color: #ffc368; color: white; margin: 2em auto; border-radius: 4px; width: 10em;">Más popular</p>
    <h2 style="margin-bottom: 0.3em;">Pro</h2>
    <p id="plan-current-basico" class="plan-current-text"></p>
    <h1 style="font-weight: normal;">99,99€<span style="font-size:18px; font-weight:normal;">/mes</span></h1>
    <p class="plan-price-note">o 83,99€/mes pagando anual · 2 meses gratis</p>
    <button class="plan-button" onclick="location.href='/payment_form/?plan=Pro'" style="background-color: #ffc368;">Empieza</button>
    <div class="item-container"><span class="tick-icon-yellow"></span><p>Todo lo del plan Gratis</p></div>
    <div class="item-container"><span class="tick-icon-yellow"></span><p>Tu logo y colores en todas las apps</p></div>
    <div class="item-container"><span class="tick-icon-yellow"></span><p>Fotos en el menú</p></div>
    <div class="item-container"><span class="tick-icon-yellow"></span><p>Estadísticas básicas</p></div>
    <div class="item-container"><span class="tick-icon-yellow"></span><p>Dispositivos ilimitados</p></div>
    <div class="item-container"><span class="tick-icon-yellow"></span><p>Soporte por email</p></div>
    <div class="item-container" style="opacity:0.4;"><span class="tick-icon-yellow"></span><p>Sin estadísticas avanzadas</p></div>
    <div class="item-container" style="opacity:0.4;"><span class="tick-icon-yellow"></span><p>Sin personalización de tipografía</p></div>
    <div class="item-container" style="opacity:0.4;"><span class="tick-icon-yellow"></span><p>Sin exportación de estadísticas</p></div>
    <p style="margin-top: 1.5em; font-size: 13px; color: #888;">0,5% de comisión por transacción</p>
  </div>

  <!-- PLAN PREMIUM -->
  <div class="plan" style="padding-top: 4.7em;">
    <h2 style="margin-bottom: 0.3em;">Premium</h2>
    <p id="plan-current-premium" class="plan-current-text"></p>
    <h1 style="font-weight: normal;">159,99€<span style="font-size:18px; font-weight:normal;">/mes</span></h1>
    <p class="plan-price-note">o 133,99€/mes pagando anual · 2 meses gratis</p>
    <button class="plan-button" onclick="location.href='/payment_form/?plan=Premium'" style="background-color: #ffc368;">Empieza</button>
    <div class="item-container"><span class="tick-icon-yellow"></span><p>Todo lo del plan Pro</p></div>
    <div class="item-container"><span class="tick-icon-yellow"></span><p>Colores y tipografía completamente personalizados</p></div>
    <div class="item-container"><span class="tick-icon-yellow"></span><p>Estadísticas completas + exportación</p></div>
    <div class="item-container"><span class="tick-icon-yellow"></span><p>Dispositivos ilimitados</p></div>
    <div class="item-container"><span class="tick-icon-yellow"></span><p>Soporte prioritario por teléfono</p></div>
    <p style="margin-top: 1.5em; font-size: 13px; color: #ccc;">Sin comisión por transacción</p>
  </div>

</div>

<h3 style="text-align: center;">Compara los planes</h3>

<div class="table-container">
  <table>
    <thead>
      <tr>
        <th style="width: 400px;"></th>
        <th style="width: 200px; text-align: center;">
          <h2>Gratis</h2>
          <button class="plan-button2" onclick="location.href='/payment_form/?plan=Gratis'">Empieza</button>
        </th>
        <th style="width: 200px; text-align: center;">
          <h2>Pro</h2>
          <button class="plan-button2" onclick="location.href='/payment_form/?plan=Pro'">Empieza</button>
        </th>
        <th style="width: 200px; text-align: center;">
          <h2>Premium</h2>
          <button class="plan-button2" onclick="location.href='/payment_form/?plan=Premium'">Empieza</button>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Precio mensual</td>
        <td style="text-align: center;">0€</td>
        <td style="text-align: center;">99,99€/mes</td>
        <td style="text-align: center;">159,99€/mes</td>
      </tr>
      <tr>
        <td>Precio anual (2 meses gratis)</td>
        <td style="text-align: center;">—</td>
        <td style="text-align: center;">83,99€/mes</td>
        <td style="text-align: center;">133,99€/mes</td>
      </tr>
      <tr>
        <td>TPV completo</td>
        <td style="text-align: center;">✓</td>
        <td style="text-align: center;">✓</td>
        <td style="text-align: center;">✓</td>
      </tr>
      <tr>
        <td>App cocina</td>
        <td style="text-align: center;">✓</td>
        <td style="text-align: center;">✓</td>
        <td style="text-align: center;">✓</td>
      </tr>
      <tr>
        <td>App camareros (PDA)</td>
        <td style="text-align: center;">✓</td>
        <td style="text-align: center;">✓</td>
        <td style="text-align: center;">✓</td>
      </tr>
      <tr>
        <td>App cliente (pedidos y pago)</td>
        <td style="text-align: center;">✓</td>
        <td style="text-align: center;">✓</td>
        <td style="text-align: center;">✓</td>
      </tr>
      <tr>
        <td>Panel propietario</td>
        <td style="text-align: center;">Básico</td>
        <td style="text-align: center;">Completo</td>
        <td style="text-align: center;">Completo</td>
      </tr>
      <tr>
        <td>Marca en las apps</td>
        <td style="text-align: center;">Nuestra marca</td>
        <td style="text-align: center;">Tu logo y colores</td>
        <td style="text-align: center;">Personalización total</td>
      </tr>
      <tr>
        <td>Fotos en el menú</td>
        <td style="text-align: center;">✗</td>
        <td style="text-align: center;">✓</td>
        <td style="text-align: center;">✓</td>
      </tr>
      <tr>
        <td>Colores personalizados</td>
        <td style="text-align: center;">✗</td>
        <td style="text-align: center;">✓</td>
        <td style="text-align: center;">✓</td>
      </tr>
      <tr>
        <td>Tipografía personalizada</td>
        <td style="text-align: center;">✗</td>
        <td style="text-align: center;">✗</td>
        <td style="text-align: center;">✓</td>
      </tr>
      <tr>
        <td>Estadísticas</td>
        <td style="text-align: center;">✗</td>
        <td style="text-align: center;">Básicas</td>
        <td style="text-align: center;">Completas</td>
      </tr>
      <tr>
        <td>Exportación de estadísticas</td>
        <td style="text-align: center;">✗</td>
        <td style="text-align: center;">✗</td>
        <td style="text-align: center;">✓</td>
      </tr>
      <tr>
        <td>Comisión por transacción</td>
        <td style="text-align: center;">1,5%</td>
        <td style="text-align: center;">0,5%</td>
        <td style="text-align: center;">Sin comisión</td>
      </tr>
      <tr>
        <td>Soporte</td>
        <td style="text-align: center;">✗</td>
        <td style="text-align: center;">Email</td>
        <td style="text-align: center;">Teléfono prioritario</td>
      </tr>
    </tbody>
  </table>
</div>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    function updateSubscriptionPlan(plan) {
      console.log('Updating subscription plan:', plan);
      if (plan) {
        if (plan === 'Gratis') {
          document.getElementById('plan-current-gratis').innerText = 'Tu plan actual';
        } else if (plan === 'Pro') {
          document.getElementById('plan-current-basico').innerText = 'Tu plan actual';
        } else if (plan === 'Premium') {
          document.getElementById('plan-current-premium').innerText = 'Tu plan actual';
        }
        document.querySelectorAll(".plan-button, .plan-button2").forEach(button => {
          if (button.innerText.trim() === "Empieza") {
            button.innerText = "Cambiar";
          }
        });
      }
    }

    function fetchSubscriptionPlan(email) {
      fetch('/.netlify/functions/server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_subscription_plan', email: email })
      })
      .then(response => response.json())
      .then(data => {
        if (data && data.product_name) {
          updateSubscriptionPlan(data.product_name);
        }
      })
      .catch(error => console.error('Error fetching subscription plan:', error));
    }

    netlifyIdentity.init();
    netlifyIdentity.on('init', user => {
      if (user && user.email) {
        fetchSubscriptionPlan(user.email);
      }
    });
  });
</script>