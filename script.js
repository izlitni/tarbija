/* ── Core transform ──────────────────────────────────── */
function makeMeCute(name) {
    if (!name || typeof name !== 'string') return '';

    const firstName = name.trim().split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!firstName) return '';

    const digraphs = {
        th: '#', sh: '@', ch: '&', ph: '*', wh: '%',
        wr: '$', dh: '!', gh: '?', qu: ':'
    };

    const reverseDigraphs = Object.fromEntries(
        Object.entries(digraphs).map(([k, v]) => [v, k])
    );
    const placeholderRegex = new RegExp(
        `[${Object.values(digraphs).map(c => '\\' + c).join('')}]`, 'g'
    );
    const restore = str => str.replace(placeholderRegex, m => reverseDigraphs[m]);

    let digr = firstName.replace(
        new RegExp(`(${Object.keys(digraphs).join('|')})`, 'g'),
        match => digraphs[match]
    );
    let consonants = digr.replace(/[aeiou]/g, '');

    const endsWithVowel = /[aeiou]/.test(firstName.at(-1));
    const tail = endsWithVowel ? firstName.at(-1) : '';
    const [c0, c1, c2, c3, c4] = consonants;

    let result;
    switch (consonants.length) {
        case 5: result = `${c0}a${c1}${c2}ou${c3}${c4}${tail}`; break;
        case 4: result = `${c0}a${c1}${c2}ou${c3}${tail}`;      break;
        case 3: result = `${c0}a${c1}${c1}ou${c2}${tail}`;      break;
        case 2: result = `${c0}a${c1}${c0}ou${c1}${tail}`;      break;
        default: return 'cute';
    }

    return restore(result);
}

/* ── State ───────────────────────────────────────────── */
let mode = 'girl'; // 'girl' | 'boy'

/* ── DOM refs ────────────────────────────────────────── */
const input    = document.getElementById('name');
const output   = document.getElementById('output');
const btn      = document.getElementById('enterBtn');
const btnGirl  = document.getElementById('btnGirl');
const btnBoy   = document.getElementById('btnBoy');
const pillSlider = document.getElementById('pillSlider');
const sparklesEl = document.getElementById('sparkles');

/* ── Sparkle sets ────────────────────────────────────── */
const girlSparkles = ['✨','🌸','⭐','💖','🌷','✿'];
const boySparkles  = ['⚡','🌊','🏄','💙','🐬','🎮'];

function setSparkles(set) {
    sparklesEl.innerHTML = set
        .map(e => `<span class="sparkle">${e}</span>`)
        .join('');
}

/* ── Mode switching ──────────────────────────────────── */
function setMode(newMode) {
    mode = newMode;
    document.body.dataset.mode = mode;

    if (mode === 'girl') {
        btnGirl.classList.add('active');
        btnBoy.classList.remove('active');
        pillSlider.style.transform = 'translateX(0)';
        setSparkles(girlSparkles);
    } else {
        btnBoy.classList.add('active');
        btnGirl.classList.remove('active');
        pillSlider.style.transform = 'translateX(100%)';
        setSparkles(boySparkles);
    }

    // re-run if there's already a result showing
    if (output.textContent) runTransform(true);
}

btnGirl.addEventListener('click', () => setMode('girl'));
btnBoy.addEventListener('click',  () => setMode('boy'));

/* ── Transform ───────────────────────────────────────── */
function runTransform(silent = false) {
    const val = input.value.trim();
    if (!val && !silent) return;

    // on silent re-run (mode switch), keep the last input stored
    const src = val || input.dataset.last || '';
    if (!src) return;
    if (val) input.dataset.last = val;

    let result = makeMeCute(src);
    if (!result) return;

    // Girl mode: append "a" unless result already ends with "a"
    if (mode === 'girl' && !result.endsWith('a')) {
        result += 'a';
    }

    output.classList.remove('pop');
    void output.offsetWidth;
    output.textContent = result;
    output.classList.add('pop');

    if (!silent) {
        input.value = '';
        input.dataset.last = src;
        input.focus();
    }
}

input.addEventListener('keyup', e => { if (e.key === 'Enter') runTransform(); });
btn.addEventListener('click', () => runTransform());

/* ── Init ────────────────────────────────────────────── */
setMode('girl');
