/* Public anon key only: the database allows submission, never public reads. */
(() => {
  'use strict';
  const form = document.querySelector('#review-form');
  const button = document.querySelector('#submit');
  const error = document.querySelector('#error');
  const loading = document.querySelector('#loading');
  const config = window.MVS_REVIEW_CONFIG;
  const consentVersion = '2026-10-13-v1';
  let inFlight = false;
  let attempt = null;

  function showError(message) {
    error.textContent = message;
    error.hidden = false;
    error.focus();
  }

  loading.hidden = true;
  if (!config?.url || !config?.anonKey || !window.crypto?.randomUUID) {
    showError('The form could not load. Please refresh, or email your feedback to jb@trustmvs.com.');
    return;
  }
  button.disabled = false;

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (inFlight) return;
    for (const name of ['name', 'email', 'business', 'testimonial']) {
      form.elements[name].value = form.elements[name].value.trim();
    }
    if (!form.reportValidity()) return;
    if (form.elements.testimonial.value.length < 20) {
      showError('Please share at least 20 characters about your experience.');
      return;
    }
    if (form.elements.website.value) {
      showError('Unable to accept submission. Please refresh or email jb@trustmvs.com.');
      return;
    }
    const fields = {
      p_name: form.elements.name.value,
      p_email: form.elements.email.value,
      p_business: form.elements.business.value,
      p_testimonial: form.elements.testimonial.value,
      p_permission: form.elements.permission.checked,
      p_consent_version: consentVersion,
      p_website: '',
    };
    const signature = JSON.stringify(fields);
    if (!attempt || attempt.signature !== signature) {
      attempt = { signature, id: crypto.randomUUID() };
    }
    const payload = { ...fields, p_id: attempt.id };
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    inFlight = true;
    button.disabled = true;
    button.textContent = 'Sending…';
    error.hidden = true;
    try {
      const response = await fetch(`${config.url}/rest/v1/rpc/submit_mvs_testimonial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: config.anonKey, Authorization: `Bearer ${config.anonKey}` },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || result.accepted !== true || result.receipt !== attempt.id) {
        if (result.message?.startsWith('Submissions are temporarily limited.')) {
          throw new Error('Submissions are temporarily limited. Please try again later, or email jb@trustmvs.com.');
        }
        throw new Error('We could not confirm that your feedback was saved. Please try again, or email jb@trustmvs.com.');
      }
      document.querySelector('#permission-summary').textContent = fields.p_permission
        ? 'You gave us permission to feature your words with your name and business on trustmvs.com. Your email stays private, and nothing publishes automatically.'
        : 'Your feedback will stay private. You have not given permission for us to publish it.';
      document.querySelector('#receipt').textContent = result.receipt;
      form.hidden = true;
      const success = document.querySelector('#success');
      success.hidden = false;
      success.focus();
      form.reset();
    } catch (failure) {
      const message = failure instanceof Error && failure.message.startsWith('Submissions are temporarily limited.')
        ? failure.message
        : 'We could not confirm that your feedback was saved. Your text is still here. Please try again, or email jb@trustmvs.com.';
      showError(message);
    } finally {
      clearTimeout(timeout);
      inFlight = false;
      button.disabled = false;
      button.textContent = 'Send my feedback →';
    }
  });
})();
