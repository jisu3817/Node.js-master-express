# Node.js-master-express

**✨ express에서 가장 중요한 기능 두가지**

- 라우트
- 미들웨어

> express 사용

```jsx
//express 모듈 설치하기
npm install express --save

//express 사용 방법. (서버 실행하기)
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
	res.send('Hello Word!')
})

app.listen(port, () => {
			console.log(`${port}번 포트로 서버 가동`)
})
```

> 경로 매개 변수 (query string → clean URL)

URL의 해당 위치에 지정된 값을 캡쳐하는데 사용되는 명명된 URL 세그먼트 

캡쳐 된 값은 `req.params` 경로에 각 키로 지정된 경로 매개 변수 이름으로 객체에 채워진다. 

```jsx
//ex)
Route path: /page/:pageId/:chapterId
Request URL: http://localhost:3000/page/html/333
req.params: { "pageId": "html", "bookId": "333"}

//다음과 같이 경로에 매개 변수 지정
app.get('/page/:pageId', (req, res) => {
	res.send(req.params)
})
```

> express redirect

```jsx
//기존 방식
res.writeHead(302, {Location: '/'});
res.end();

//express 
res.redirect('/');
```

> 미들웨어

미들웨어 함수는 요청, 응답, next 애플리케이션의 요청-응답주기에 있는 함수에

액세스 할 수 있는 함수

`next기능`은 Express 라우터의 기능으로 호출시 현재 미들웨어에 이어서 실행될 미들웨어가 담겨 있다.

현재 사용중인 미들웨어는 application-level middlewere, Third-party middlewere

**미들웨어의 기능**

- 코드 실행
- 요청 및 응답 객체 변경
- 요청-응답주기 종료
- 스택 다음 미들웨어 호출

미들웨어로드 `순서`가 중요하다. 먼저 로드 된 미들웨어 함수가 먼저 실행된다. 

```jsx
vaar express = require('express')
var app = express()

app.use((req, res, next) => {
	console.log('LOGGED')
	next();
}

app.get('/', (req, res) => {
	res.send('Hello Word!')
})

app.listen(3000)
```

해당 미들웨어가 필요하지 않은 경우에 실행하는 것은 비효율적임 따라서 

app.use를 `app.get('*', (req . . .` 으로 변경해주면 get 방식으로 들어오는 요청에만 해당 미들웨어 실행. 

> 정적인 파일

```jsx
//정적인 파일을 호출하기 위한 미들웨어 호출
app.use(express.static(경로));
```

> 에러 처리

- 404 에러 처리 (경로를 찾을 수 없을 때)

미들웨어는 순서대로 실행하므로 코드에서 순서대로 경로를 찾아보고, 해당 경로가 없을 경우 에러가 실행되어야 하므로 실행 코드 `**가장 하단**`에 처리해 줘야 한다. 

```jsx
app.use((req, res, next) => {
	res.status(404).send('Sorry cant find that!');
});
```

- 500 에러 처리 (Writing Error Handlers)

Internal server error 내부적 서버 오류 (일반적인 에러 메세지)

**`404에러를 처리하는 코드 밑에 작성!`**

```jsx
app.use((err, req, res, next) => {
	console.log(err.stack)
	res.status(500).send('Something broke!')
});
//err에는 next를 통해서 전달받을 에러 데이터가 담겨있다.
```

> express router

일종의 미니 앱 생성 

라우터를 모듈로 생성하고, 그 안에 미들웨어 기능을 로드, 일부 경로를 정의, 라우터 모듈을 메인 앱의 경로에 마운트한다. 

- topic.js

```jsx
const express = require('express')
const router = express.Router()

router.get('/create', (req, res) => {

	// ...

	res.send('html') 
});

router.post('/create_process', (req, res) => {
	
	// ...

	res.redirect('/topic/${title}');
});

module.exports = router;
```

- 라우터 모듈 로드

```jsx
const topicRouter = require('./topic')

//..

app.use('/topic', topicRouter);
```

> 보안

- Use Helmet

보안과 관련된 여러 가지 단골 보안 이슈를 자동으로 해결해준다. 

```jsx
//설치
npm i --save helmet

//코드에서 사용하기
const helmet = require('hemlet');
app.use(hemlet());
```

- nsp

웹 애플리케이션이 사용하는 모듈 중 취약점이 있을 수 있으므로 dependencies를 nsp 설치를 통해 보안 체크 

```jsx
//설치
sudo npm i nsp -g

//문제가 될만한 것들이 있는지 검사 
nsp check
```
