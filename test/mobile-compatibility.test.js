const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

function readAssessmentData() {
  const start = html.indexOf('const P=');
  const end = html.indexOf('let saved=', start);
  assert.notEqual(start, -1, '해석 데이터 시작점을 찾을 수 있어야 합니다.');
  assert.notEqual(end, -1, '해석 데이터 끝점을 찾을 수 있어야 합니다.');

  const context = {};
  vm.createContext(context);
  vm.runInContext(`${html.slice(start, end)};globalThis.data={P,Q};`, context);
  return context.data;
}

test('검사 데이터는 9유형별 5문항, 총 45문항을 유지한다', () => {
  const { P, Q } = readAssessmentData();
  assert.equal(Q.length, 45);
  assert.equal(Object.keys(P).length, 9);
  for (let type = 1; type <= 9; type += 1) {
    assert.equal(Q.filter(([questionType]) => questionType === type).length, 5);
    assert.deepEqual(Object.keys(P[type]), ['n', 'm', 'f', 'a', 's', 'c', 'talk']);
  }
});

test('45문항과 결과해석 내용은 main 기준 원문 그대로 유지한다', () => {
  const normalized = html.replace(/\r\n/g, '\n');
  const dataSource = normalized.slice(
    normalized.indexOf('const P='),
    normalized.indexOf('let saved='),
  );
  const digest = crypto.createHash('sha256').update(dataSource).digest('hex');
  assert.equal(digest, 'e24d3f3470434e7e5c07d230abd8c887553b8819eb9ea16c20648f0dc4ce3730');
});

test('인라인 앱 스크립트 전체가 문법 오류 없이 해석된다', () => {
  const script = html.match(/<script>([\s\S]*)<\/script>/)?.[1];
  assert.ok(script);
  assert.doesNotThrow(() => new vm.Script(script));
});

test('채점, TOP3 정렬, 3센터 계산식은 기존 규칙을 유지한다', () => {
  assert.match(html, /const score=\(\)=>\{let s=\{1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0\}/);
  assert.match(html, /sort\(\(a,b\)=>b\.v-a\.v\|\|a\.t-b\.t\)/);
  assert.match(html, /heart:s\[2\]\+s\[3\]\+s\[4\],head:s\[5\]\+s\[6\]\+s\[7\],body:s\[8\]\+s\[9\]\+s\[1\]/);
});

test('웹 화면은 동일한 Noto Sans KR 웹폰트와 공통 글자 크기 변수를 사용한다', () => {
  assert.match(html, /fonts\.googleapis\.com\/css2\?family=Noto\+Sans\+KR/);
  assert.match(html, /--font-ui:"Noto Sans KR"/);
  assert.match(html, /--text-body:clamp\(/);
  assert.match(html, /font-family:var\(--font-ui\)/);
});

test('긴 한글 문장은 어절 단위 줄바꿈과 넘침 방지를 적용한다', () => {
  assert.match(html, /word-break:keep-all/);
  assert.match(html, /overflow-wrap:break-word/);
  assert.match(html, /\.top-copy\{min-width:0/);
});

test('TOP3 카드는 좁은 화면에서도 순위와 본문을 분리한다', () => {
  assert.match(html, /\.top>div\{display:grid;grid-template-columns:auto minmax\(0,1fr\)/);
  assert.match(html, /class="top-copy"/);
});

test('레이더차트는 정사각형 비율의 반응형 컨테이너를 사용한다', () => {
  assert.match(html, /\.radar-wrap\{[^}]*aspect-ratio:1/);
  assert.match(html, /class="radar-wrap"/);
  assert.match(html, /<svg viewBox="0 0 340 340" role="img"/);
});

test('3센터 카드는 매우 좁은 화면에서 세로로 전환된다', () => {
  assert.match(html, /@media\(max-width:390px\)\{\.centers\{grid-template-columns:1fr\}/);
  assert.match(html, /\.center\{[^}]*min-width:0/);
});

test('결과 PNG는 웹폰트를 기다리고 공통 줄바꿈 도우미를 사용한다', () => {
  assert.match(html, /await waitForResultFont\(document\)/);
  assert.match(html, /function wrapCanvasText\(/);
  assert.match(html, /wrapCanvasText\(x,text,900\)/);
  assert.match(html, /"Noto Sans KR",sans-serif/);
});
