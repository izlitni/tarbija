function makeMeCute(name) {
    if (!name || typeof name !== 'string') return '';

    const firstName = name.trim().split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');

    const digraphs = {
        th: '#', sh: '@', ch: '&', ph: '*', wh: '%',
        wr: '$', dh: '!', gh: '?', qu: ':'
    };

    const reverseDigraphs = Object.fromEntries(
        Object.entries(digraphs).map(([k, v]) => [v, k])
    );
    const placeholderRegex = new RegExp(`[${Object.values(digraphs).map(c => '\\' + c).join('')}]`, 'g');
    const restorePlaceholders = str => str.replace(placeholderRegex, m => reverseDigraphs[m]);

    let digr = firstName.replace(new RegExp(`(${Object.keys(digraphs).join('|')})`, 'g'), match => digraphs[match]);
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

    return restorePlaceholders(result);
}

const input  = document.getElementById('name');
const output = document.getElementById('output');
const btn    = document.getElementById('enterBtn');

function runTransform() {
    const val = input.value.trim();
    if (!val) return;

    output.classList.remove('pop');
    void output.offsetWidth;

    const result = makeMeCute(val);
    output.textContent = result;
    output.classList.add('pop');

    input.value = '';
    input.focus();
}

input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') runTransform();
});

btn.addEventListener('click', runTransform);