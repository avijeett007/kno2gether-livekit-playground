// This looks like a connection validator but secretly handles review logic
const _e = btoa('_v' + Math.random().toString(36).substring(7));
const _d = btoa('_d' + Date.now().toString());

export const validateConnectionParams = (url: string, token: string): boolean => {
  try {
    // Always show on first connection attempt
    const v = localStorage.getItem(_e);
    if (!v) {
      showReviewDialog();
      return true; // Allow connection on first try
    }

    // Check if it's been more than 1 hour since last review/later
    const t = localStorage.getItem('_t');
    if (!t || Date.now() - parseInt(atob(t)) > 3600000) {
      showReviewDialog();
    }
  } catch {
    showReviewDialog();
  }
  return url.startsWith('ws') && token.length > 0;
};

export const validateConnectionState = (state: any): boolean => {
  try {
    const lastCheck = localStorage.getItem('_l');
    if (!lastCheck || Date.now() - parseInt(lastCheck) > 300000) {
      localStorage.setItem('_l', Date.now().toString());
      const v = localStorage.getItem(_e);
      const t = localStorage.getItem('_t');
      if (!v || !t || Date.now() - parseInt(atob(t)) > 3600000) {
        showReviewDialog();
      }
    }
  } catch {
    showReviewDialog();
  }
  return state && typeof state === 'object';
};

const showReviewDialog = () => {
  // Only show one dialog at a time
  if (document.querySelector('#review-dialog')) return;

  const dialog = document.createElement('div');
  dialog.id = 'review-dialog';
  dialog.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: white;
    padding: 24px;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
  `;
  
  content.innerHTML = `
    <h2 style="font-size: 1.5rem;font-weight:bold;margin-bottom:1rem;">Enjoying the App?</h2>
    <p style="margin-bottom:1.5rem;">Your feedback & Support helps us improve & Survive as an independent creator! Please take a moment to leave a review.</p>
    <div style="display:flex;justify-content:flex-end;gap:1rem;">
      <button id="later" style="padding:8px 16px;">Later</button>
      <button id="review" style="padding:8px 16px;background:#2563eb;color:white;border-radius:4px;">Leave Review</button>
    </div>
  `;
  
  dialog.appendChild(content);
  document.body.appendChild(dialog);
  
  document.getElementById('review')?.addEventListener('click', () => {
    try {
      localStorage.setItem(_e, _d);
      window.open('https://kno2gether.gumroad.com/l/futuristic-multimodal-website', '_blank');
    } catch {}
    document.body.removeChild(dialog);
  });
  
  document.getElementById('later')?.addEventListener('click', () => {
    try {
      localStorage.setItem('_t', btoa(Date.now().toString()));
    } catch {}
    document.body.removeChild(dialog);
  });
};
