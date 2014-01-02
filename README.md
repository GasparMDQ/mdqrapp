MDQ Rollers App
===============

Config de la APP
----------------

Siendo root setear las siguientes variables:

`$export <nombre variable>=<valor>`

`ROOT_URL=http://mdqrollers.openshift.com.ar`
`MONGO_URL=mongodb://<usuario>:<password>@ds061318.mongolab.com:61318/mdqrapp`


Ejecutar meteorite con el parametro: `--port=80`

`$mrt --port=80`


El deploy en Heroku se realiza con las instrucciones indicadas en:
`https://github.com/oortcloud/heroku-buildpack-meteorite`
