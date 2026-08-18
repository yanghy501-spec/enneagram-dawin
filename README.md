# enneagram-dawin

DAWIN 교육용 **애니어그램 자기탐색 Web v1.0** 정적 웹앱입니다.

## 공개 주소
GitHub Pages 활성화 후:

`https://yanghy501-spec.github.io/enneagram-dawin/`

QR 파일: `qr.svg`

## v1.0 기능
- 정적 `index.html` 단일 파일 방식
- 회원가입, 로그인, 이름 입력 없음
- 서버/데이터베이스 없음
- 45문항, 9유형 × 5문항
- 5문항 × 9페이지
- 1~5점 척도
- 브라우저 `localStorage` 임시저장
- 9유형 원점수 및 TOP3
- 감정·사고·본능 3센터
- 막대그래프 + 레이더차트
- TOP3 핵심동기 비교 후 최종 유형 자기선택
- 결과카드 PNG 저장

## 중요한 사용 원칙
본 웹앱은 **교육 및 자기탐색 목적으로 제작된 간이 도구**입니다. 표준화된 심리검사, 의료·심리 진단도구, 채용·인사평가 도구가 아닙니다.

문항은 상용 RHETI 문항을 복제하지 않고 독립적으로 작성했습니다.

## 데이터 처리
참가자의 이름·이메일·사번 등 개인식별정보를 입력받지 않습니다. 응답은 외부 서버로 전송하지 않고, 진행 중 유실을 막기 위해 현재 기기의 브라우저 `localStorage`에만 임시 저장합니다. `다시 검사`를 선택하면 해당 저장 데이터를 삭제합니다.

## GitHub Pages 켜기
1. 저장소에서 **Settings** 클릭
2. 왼쪽 메뉴 **Pages** 클릭
3. **Build and deployment → Source**를 `Deploy from a branch`로 선택
4. **Branch**를 `main`, 폴더를 `/(root)`로 선택
5. **Save** 클릭
6. 배포 완료 후 `https://yanghy501-spec.github.io/enneagram-dawin/` 접속

## 파일
- `index.html` : 앱 전체 화면·문항·채점·결과 로직
- `qr.svg` : 공개 주소 QR
- `.nojekyll` : GitHub Pages 정적 파일 처리용
