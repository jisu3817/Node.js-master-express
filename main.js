var express = require('express')
var app = express()
var fs = require('fs');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');
var bodyParser = require('body-parser');
var compression = require('compression');

app.use(bodyParser.urlencoded ({extended: false}));
app.use(compression());
app.get('*', (request, response, next) => {
  fs.readdir('./data', (error, filelist) => {
    request.list = filelist;
    next();
  });
});

app.get('/', (request, response) => {
  var title = 'Welcome'; 
  var description = 'Hello, Node.js';
  var list = template.list(request.list);
  var html = template.HTML(title, list,
    `<h2>${title}</h2>${description}`,
    `<a href="/create">create</a>`
  );
  response.send(html);
});

app.get('/page/:pageId', (request, response) => {
  var filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
    var title = request.params.pageId;
    var sanitizedTitle = sanitizeHtml(title);
    var sanitizedDescription = sanitizeHtml(description, {
      allowedTags:['h1']
    });
    var list = template.list(request.list);
    var html = template.HTML(sanitizedTitle, list,
      `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
      ` <a href="/create">create</a>
        <a href="/update/${sanitizedTitle}">update</a>
        <form action="/delete_process" method="post">
          <input type="hidden" name="id" value="${sanitizedTitle}">
          <input type="submit" value="delete">
        </form>`
    );
    response.writeHead(200);
    response.end(html);
  });
});

app.get('/create', (request, response) => {
  var title = 'WEB - create';
  var list = template.list(request.list);
  var html = template.HTML(title, list, `
    <form action="/create_process" method="post">
      <p><input type="text" name="title" placeholder="title"></p>
      <p>
        <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
        <input type="submit">
      </p>
    </form> 
  `, '');
  response.send(html);
});

app.post('/create_process', (request, response) => {
  var post = request.body;
  var title = post.title;
  var description = post.description;
  fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
    response.redirect(`/?id=${title}`)
  });
});

app.get('/update/:updateId', (request, response) => {
  var filteredId = path.parse(request.params.updateId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
    var title = request.params.updateId;
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `
      <form action="/update_process" method="post">
        <input type="hidden" name="id" value="${title}">
        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
        <p>
          <textarea name="description" placeholder="description">${description}</textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
      `,
      `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
    ); 
    response.send(html);
  });
});

app.post('/update_process', (request,response) => {
  var post = request.body;
  var id = post.id;
  var title = post.title;
  var description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, (error) => {
    fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
      response.redirect(`/?id=${title}`);
    });
  });
});

app.post('/delete_process', (request, response) => {
  var post = request.body;
  var id = post.id;
  var filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, (error) => {
    response.redirect('/');
  });
});

app.listen(3000, () => console.log('3000번 포트로 서버 가동!'))

 