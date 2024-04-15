---
title: Contact
permalink: /contact/
---

<!-- markdownlint-disable MD033 -->
<form name="contact" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="contact" />
  <p>
    <label for="name">Your Name:</label><br />
    <input type="text" id="name" name="name" required />
  </p>
  <p>
    <label for="email">Your Email:</label><br />
    <input type="email" id="email" name="email" required />
  </p>
  <p>
    <label for="message">Message:</label><br />
    <textarea id="message" name="message" rows="5" required></textarea>
  </p>
  <p>
    <button type="submit">Send</button>
  </p>
</form>
