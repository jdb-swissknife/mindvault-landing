const STORAGE_KEY = 'aieWorkspace.v1';

const els = {
  tabs: document.getElementById('tabs'),
  panels: document.getElementById('panels'),
  niche: document.getElementById('nicheInput'),
  client: document.getElementById('clientInput'),
  offer: document.getElementById('offerInput'),
  channel: document.getElementById('channelInput'),
  loadStatus: document.getElementById('loadStatus'),
  masterPrompt: document.getElementById('masterPrompt'),
  reportTemplate: document.getElementById('reportTemplate'),
};

let categories = [];
let reportTemplateSource = '';
let state = {
  currentTab: 0,
  niche: '[YOUR NICHE]',
  client: '',
  offer: '',
  channel: '',
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    state = { ...state, ...saved };
  } catch (error) {
    console.warn('Could not load saved state', error);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getContext() {
  return {
    niche: state.niche || '[YOUR NICHE]',
    nicheLower: (state.niche || '[YOUR NICHE]').toLowerCase(),
    client: state.client || 'Internal / unspecified client',
    offer: state.offer || 'Unspecified offer',
    channel: state.channel || 'Unspecified channel',
    date: new Date().toISOString().slice(0, 10),
  };
}

function applyTokens(text) {
  const ctx = getContext();
  return text
    .replaceAll('[NICHE]', ctx.niche)
    .replaceAll('[niche]', ctx.nicheLower)
    .replaceAll('{{NICHE}}', ctx.niche)
    .replaceAll('{{CLIENT_NAME}}', ctx.client)
    .replaceAll('{{OFFER_NAME}}', ctx.offer)
    .replaceAll('{{PRIMARY_CHANNEL}}', ctx.channel)
    .replaceAll('{{DATE}}', ctx.date);
}

function highlightTokens(text) {
  const escaped = escapeHtml(text);
  return escaped
    .replaceAll('[NICHE]', `<span class="token">${escapeHtml(getContext().niche)}</span>`)
    .replaceAll('[niche]', `<span class="token">${escapeHtml(getContext().nicheLower)}</span>`);
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function render() {
  syncInputs();
  renderTabs();
  renderPanel();
  renderMasterPrompt();
  renderReportTemplate();
  saveState();
}

function syncInputs() {
  els.niche.value = state.niche === '[YOUR NICHE]' ? '' : state.niche;
  els.client.value = state.client;
  els.offer.value = state.offer;
  els.channel.value = state.channel;
}

function renderTabs() {
  els.tabs.innerHTML = '';
  categories.forEach((cat, index) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = `tab${index === state.currentTab ? ' active' : ''}`;
    tab.style.background = index === state.currentTab ? `${cat.color}22` : '';
    tab.style.borderColor = index === state.currentTab ? cat.color : '';
    tab.innerHTML = `<span class="tab-dot" style="background:${cat.color}"></span>${escapeHtml(cat.name)}`;
    tab.addEventListener('click', () => {
      state.currentTab = index;
      render();
    });
    els.tabs.appendChild(tab);
  });
}

function renderPanel() {
  els.panels.innerHTML = '';
  const cat = categories[state.currentTab];
  if (!cat) return;

  const template = document.getElementById('panelTemplate');
  const panel = template.content.cloneNode(true);
  const header = panel.querySelector('.panel-header');
  const grid = panel.querySelector('.platform-grid');

  header.innerHTML = `<h2>${escapeHtml(cat.name)}</h2><p>${escapeHtml(cat.desc)}</p>`;

  cat.platforms.forEach((platform, platformIndex) => {
    const card = document.createElement('article');
    card.className = 'platform-card';
    card.innerHTML = `<div class="platform-badge"><span>${escapeHtml(platform.icon)}</span>${escapeHtml(platform.name)}</div>`;

    platform.prompts.forEach((prompt, promptIndex) => {
      const id = `prompt-${state.currentTab}-${platformIndex}-${promptIndex}`;
      const wrap = document.createElement('div');
      wrap.className = 'prompt-wrap';
      wrap.innerHTML = `
        <div class="prompt-toolbar"><button class="mini-btn" type="button" data-copy-id="${id}">Copy</button></div>
        <div class="prompt-block" id="${id}">${highlightTokens(prompt)}</div>
      `;
      wrap.querySelector('button').addEventListener('click', () => {
        copyText(applyTokens(prompt), wrap.querySelector('button'), 'Copied');
      });
      card.appendChild(wrap);
    });

    grid.appendChild(card);
  });

  els.panels.appendChild(panel);
}

function buildMasterPrompt() {
  const ctx = getContext();
  return `You are an expert audience research analyst. Analyze the raw social media data I provide and produce a comprehensive Audience Intelligence Report.

CLIENT: ${ctx.client}
OFFER / PRODUCT: ${ctx.offer}
PRIMARY CHANNEL: ${ctx.channel}
TARGET NICHE: ${ctx.niche}

---

PASTE RAW DATA BELOW
Include Reddit posts/comments, LinkedIn posts/comments, X posts/replies, YouTube comments, Quora questions/answers, reviews, testimonials, call notes, or customer interviews.

[PASTE RAW DATA HERE]

---

Rules:
- Use the audience's actual language whenever possible.
- Label assumptions clearly.
- Do not invent quotes.
- Separate evidence from interpretation.
- Prioritize patterns that appear repeatedly or carry strong emotional intensity.

Produce the report with these sections:

1. Deep Desires
- Top 5-7 deepest desires, not just surface goals.
- For each: direct quote, emotional driver, identity shift, commercial implication.
- A short “dream day” narrative in their own language.

2. Fears & Frustrations
- Top 5-7 fears/frustrations categorized by financial, social, competence, timing, trust.
- For each: direct quote, intensity 1-5, frequency, what they already tried.
- The #1 “3am fear.”

3. Language & Phrases
- 20+ exact words and phrases this audience uses.
- Phrases that signal high desire.
- Phrases that signal skepticism or resistance.
- 5 headline/hook formulas extracted from their language.
- Words to avoid.

4. Objections
Create this matrix:
| Objection | Category | Frequency | Intensity | Suggested Reframe | Proof Needed |
Rank the top 3 objections most likely to kill a sale.

5. Content & Messaging Opportunities
- Top 10 proven content topics.
- Top 5 underserved gaps.
- 3 contrarian/pattern-interrupt angles.
- 5 ready-to-use hooks.
- Recommended formats by platform for ${ctx.niche}.

6. Messaging Brief
- Primary promise.
- Primary fear to acknowledge.
- Core transformation statement.
- 3 proof points they will believe.
- The sentence most likely to make them say: “This was written for me.”`;
}

function renderMasterPrompt() {
  els.masterPrompt.textContent = buildMasterPrompt();
}

function renderReportTemplate() {
  els.reportTemplate.textContent = applyTokens(reportTemplateSource);
}

function getCurrentTabText() {
  const cat = categories[state.currentTab];
  if (!cat) return '';
  const lines = headerLines(`Audience Intelligence Prompts: ${cat.name}`);
  lines.push(`Category Description: ${cat.desc}`, '');
  cat.platforms.forEach((platform) => {
    lines.push(`## ${platform.icon} ${platform.name}`, '');
    platform.prompts.forEach((prompt, index) => {
      lines.push(`### Prompt ${index + 1}`, applyTokens(prompt), '');
    });
  });
  return lines.join('\n');
}

function getPromptPackText() {
  const lines = headerLines('Audience Intelligence Prompt Pack');
  categories.forEach((cat) => {
    lines.push(`# ${cat.name}`, cat.desc, '');
    cat.platforms.forEach((platform) => {
      lines.push(`## ${platform.icon} ${platform.name}`, '');
      platform.prompts.forEach((prompt, index) => {
        lines.push(`### Prompt ${index + 1}`, applyTokens(prompt), '');
      });
    });
  });
  return lines.join('\n');
}

function getResearchBriefText() {
  const ctx = getContext();
  return `${headerLines('Audience Intelligence Research Brief').join('\n')}

## Research Objective
Understand the real desires, fears, language, objections, and content opportunities for ${ctx.niche} so ${ctx.client} can improve messaging for ${ctx.offer} on ${ctx.channel}.

## Source Plan
- Reddit: find raw pain, desires, and community language.
- LinkedIn: find professional/status language and B2B objections.
- X: find short-form hooks, complaints, and contrarian angles.
- YouTube: find comments, title patterns, and content gaps.
- Quora: find questions, decision criteria, and objections.

## Prompts to Run
${getPromptPackText()}

## Synthesis Step
After collecting raw data, run the Master Synthesis Prompt in this tool and package the result with the Audience Report Template.`;
}

function headerLines(title) {
  const ctx = getContext();
  return [
    `# ${title}`,
    '',
    `Client: ${ctx.client}`,
    `Offer: ${ctx.offer}`,
    `Primary Channel: ${ctx.channel}`,
    `Target Niche: ${ctx.niche}`,
    `Date: ${ctx.date}`,
    '',
  ];
}

async function copyText(text, button, copiedLabel = 'Copied') {
  await navigator.clipboard.writeText(text);
  if (!button) return;
  const original = button.textContent;
  button.textContent = copiedLabel;
  button.classList.add('copied');
  setTimeout(() => {
    button.textContent = original;
    button.classList.remove('copied');
  }, 1800);
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function slugify(text) {
  return String(text || 'audience-intelligence')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'audience-intelligence';
}

function updateStateFromInputs() {
  state.niche = els.niche.value.trim() || '[YOUR NICHE]';
  state.client = els.client.value.trim();
  state.offer = els.offer.value.trim();
  state.channel = els.channel.value.trim();
  render();
}

function bindEvents() {
  document.getElementById('generateBtn').addEventListener('click', updateStateFromInputs);
  [els.niche, els.client, els.offer, els.channel].forEach((input) => {
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') updateStateFromInputs();
    });
    input.addEventListener('blur', updateStateFromInputs);
  });

  document.querySelectorAll('[data-example]').forEach((button) => {
    button.addEventListener('click', () => {
      els.niche.value = button.dataset.example;
      updateStateFromInputs();
    });
  });

  document.getElementById('copyCurrentTabBtn').addEventListener('click', (event) => copyText(getCurrentTabText(), event.currentTarget, 'Copied tab'));
  document.getElementById('exportPromptPackBtn').addEventListener('click', () => downloadText(`${slugify(state.niche)}-prompt-pack.md`, getPromptPackText()));
  document.getElementById('exportBriefBtn').addEventListener('click', () => downloadText(`${slugify(state.niche)}-research-brief.md`, getResearchBriefText()));
  document.getElementById('copyMasterBtn').addEventListener('click', (event) => copyText(buildMasterPrompt(), event.currentTarget, 'Copied prompt'));
  document.getElementById('exportMasterBtn').addEventListener('click', () => downloadText(`${slugify(state.niche)}-master-synthesis-prompt.md`, buildMasterPrompt()));
  document.getElementById('copyReportBtn').addEventListener('click', (event) => copyText(applyTokens(reportTemplateSource), event.currentTarget, 'Copied template'));
  document.getElementById('exportReportBtn').addEventListener('click', () => downloadText(`${slugify(state.niche)}-audience-report-template.md`, applyTokens(reportTemplateSource)));
  document.getElementById('resetBtn').addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    state = { currentTab: 0, niche: '[YOUR NICHE]', client: '', offer: '', channel: '' };
    render();
  });
}

async function init() {
  loadState();
  bindEvents();

  try {
    const [promptResponse, templateResponse] = await Promise.all([
      fetch('./prompts.json'),
      fetch('./report-template.md'),
    ]);

    if (!promptResponse.ok) throw new Error(`Could not load prompts.json: ${promptResponse.status}`);
    if (!templateResponse.ok) throw new Error(`Could not load report-template.md: ${templateResponse.status}`);

    categories = await promptResponse.json();
    reportTemplateSource = await templateResponse.text();
    els.loadStatus.textContent = `Loaded ${categories.length} research categories.`;
    els.loadStatus.classList.add('is-ok');
    render();
  } catch (error) {
    console.error(error);
    els.loadStatus.textContent = 'Could not load app data. Run this through a local web server, not file://.';
  }
}

init();
