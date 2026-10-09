const results = {
  llama: {
    rows: [['Standard DPO',25.71],['Staged-Competence',15.90],['CovDPO-LoRA',6.75],['CovDPO-Full',2.41]],
    summary: {
      en: 'On Llama-3-8B, CovDPO-Full reduces average ASR from 15.90% for the strongest non-CovDPO baseline to 2.41%. LoRA reaches 6.75% and preserves the highest HellaSwag score among the compared methods.',
      zh: '在 Llama-3-8B 上，CovDPO-Full 将平均 ASR 从最强非 CovDPO 基线的 15.90% 降至 2.41%。LoRA 版本达到 6.75%，并在所有比较方法中取得最高 HellaSwag 分数。'
    }
  },
  qwen: {
    rows: [['Standard DPO',37.18],['Staged-Competence',11.21],['CovDPO-LoRA',7.55],['CovDPO-Full',4.60]],
    summary: {
      en: 'On Qwen3-8B, CovDPO-Full lowers average ASR from 11.21% to 4.60%. LoRA reaches 7.55% and has the highest MMLU score among the compared methods.',
      zh: '在 Qwen3-8B 上，CovDPO-Full 将平均 ASR 从 11.21% 降至 4.60%。LoRA 版本达到 7.55%，且在所有比较方法中取得最高 MMLU 分数。'
    }
  }
};
// Table 1 in the CovDPO working draft. Columns follow the paper exactly.
const mainTable = {
  llama: [
    ['Unaligned',94.60,89.10,94.00,53.09,89.00,63.00,60.75,77.65,59.50,46.10,0.00],
    ['Standard DPO',16.73,30.00,25.30,10.91,54.50,14.50,28.00,25.71,57.10,42.00,0.00],
    ['DOOR',8.65,28.22,20.00,19.09,46.25,13.75,26.25,23.17,53.14,35.20,0.00],
    ['ShaPO',1.15,13.56,12.33,1.09,37.00,7.25,52.00,17.77,61.15,52.68,0.40],
    ['Staged-Competence',11.73,20.44,20.00,6.91,36.25,3.75,12.25,15.90,56.37,42.59,0.40],
    ['CovDPO-LoRA',0.77,11.11,5.00,2.36,21.50,0.50,6.00,6.75,59.07,57.91,0.00],
    ['CovDPO-Full',0.00,1.78,0.00,0.36,14.75,0.00,0.00,2.41,57.45,54.10,0.40]
  ],
  qwen: [
    ['Unaligned',94.04,86.67,87.00,55.45,90.00,60.25,59.50,76.13,60.90,65.30,0.40],
    ['Standard DPO',41.92,34.89,32.33,18.36,71.00,18.50,43.25,37.18,60.23,68.35,0.00],
    ['DOOR',8.65,29.56,13.33,24.55,84.25,19.00,50.00,32.76,59.60,54.00,0.00],
    ['ShaPO',0.00,5.30,0.30,1.80,56.00,5.00,34.80,14.74,60.60,73.90,3.20],
    ['Staged-Competence',3.65,11.33,4.33,4.18,30.00,5.00,20.00,11.21,57.09,61.33,0.00],
    ['CovDPO-LoRA',0.19,6.67,2.00,1.27,27.50,1.25,14.00,7.55,61.85,72.98,0.80],
    ['CovDPO-Full',0.00,4.22,0.33,1.64,20.50,0.50,5.00,4.60,60.00,66.85,0.80]
  ]
};
const familySelect = document.getElementById('family-select');
const languageButton = document.getElementById('language-toggle');
let savedLanguage = 'en';
try { savedLanguage = localStorage.getItem('covdpo-language') === 'zh' ? 'zh' : 'en'; } catch (_) {}
let language = savedLanguage;
function renderResults() {
  const data = results[familySelect.value];
  document.getElementById('result-bars').replaceChildren(...data.rows.map(([label,value]) => {
    const row=document.createElement('div');
    row.className='result-row'+(label==='CovDPO-Full'?' highlight':'');
    const name=document.createElement('span');name.textContent=label;
    const track=document.createElement('div');track.className='track';
    const fill=document.createElement('div');fill.className='fill';fill.style.width=(value/40*100)+'%';track.append(fill);
    const score=document.createElement('strong');score.textContent=value.toFixed(2)+'%';
    row.append(name,track,score);return row;
  }));
  document.getElementById('result-summary').textContent=data.summary[language];
  document.getElementById('main-table-family').textContent=familySelect.value==='llama'?'Llama-3-8B':'Qwen3-8B';
  document.getElementById('main-results-body').replaceChildren(...mainTable[familySelect.value].map(([method,...values]) => {
    const row=document.createElement('tr');
    if (method.startsWith('CovDPO-')) row.className='covdpo-row'+(method==='CovDPO-LoRA'?' covdpo-start':'');
    const name=document.createElement('th');name.scope='row';name.textContent=method;row.append(name);
    values.forEach((value,index)=>{
      const cell=document.createElement('td');cell.textContent=value.toFixed(2);
      if(index===7) cell.className='average';
      row.append(cell);
    });
    return row;
  }));
}
function setLanguage(next) {
  language=next;
  document.documentElement.lang=next==='zh'?'zh-CN':'en';
  document.body.classList.toggle('zh',next==='zh');
  document.querySelectorAll('[data-en][data-zh]').forEach(el=>{el.textContent=el.dataset[next]});
  languageButton.textContent=next==='zh'?'EN':'中文';
  languageButton.setAttribute('aria-label',next==='zh'?'Switch to English':'切换到中文');
  try { localStorage.setItem('covdpo-language',next); } catch (_) {}
  renderResults();
}
familySelect.addEventListener('change',renderResults);
languageButton.addEventListener('click',()=>setLanguage(language==='en'?'zh':'en'));
setLanguage(language);
