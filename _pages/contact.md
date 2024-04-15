---
title: Contact
permalink: /contact/
---

<div class="col-sm-7 slideanim">
  <div class="row">
    <div class="col-sm-6 form-group">
      <input class="form-control" id="name" name="name" placeholder="Name" type="text" required>
    </div>
    <div class="col-sm-6 form-group">
      <input class="form-control" id="email" name="_replyto" placeholder="Email" type="email" required>
    </div>
  </div>
  <textarea class="form-control" id="comments" name="message" placeholder="Message" rows="5"></textarea><br>
  <div class="row">
    <div class="col-sm-12 form-group">
      <button class="btn btn-default pull-right" type="submit">Send</button>
    </div>
  </div>
</div>

<input type="hidden" name="_next" value="https://gastrali.netlify.app/contact" />
<input type="text" name="_gotcha" style="display:none" />

<script>
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("contactform").addEventListener("submit", function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();
        
        // Redirect the user to the contact page after form submission
        window.location.href = "https://gastrali.netlify.app/contact";
    });
});
</script>
