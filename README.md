# SimpleHttpServer
---
## Installation
~~~
    npm install express --save
    npm install body-parser --save
    npm install mysql --save
~~~

## Usage
~~~
    // Node.js v10.13.0
    // node server.js port
    // 默认端口为 8080.
    node server.js 8085
~~~


## API

### API 1
~~~
    GET: http://localhost:8085/v3/test-api
~~~

### API 2, API 3
"action" 合法值：
> "加法": plus,
> "减法": substruction,
> "乘法": multiplication,
> "除法": division

1. API 2
~~~
    GET: http://localhost:8085/v3/arithmetic/action?a=number&b=number
~~~

2. API 3
~~~
    POST: http://localhost:8085/v3/arithmetic/action
    > Request body: { a=number, b=number }
~~~

### API 4
~~~
    GET: http://localhost:8085/tutorial/student/list
~~~

### API 5
~~~
    POST: http://localhost:8085/user/self/*
    > Request body: { intAuthToken: xxxxxxxxx }
~~~