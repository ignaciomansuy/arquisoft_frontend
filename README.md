# IIC2173 - front end aplicación F.R.I.E.N.D.S. 

## Para correr la aplicación localmente
Primero, debes correr el backend siguiendo las instrucciones del README https://github.com/iic2173/e1-2022-1-grupo_15.

### Configuración de variables de entorno

Debes correr el siguiente comando en la terminal adentro del directorio del proyecto para crear el archivo `.env`.
```
touch .env
```
Luego agregar lo siguiente al archivo `.env`, junto con poner la key ID, secret key y bucket name de tu AWS S3 bucket.
```
PORT=8000
REACT_APP_API_URL=http://localhost/api
DISABLE_ESLINT_PLUGIN=true

REACT_APP_AWS_ACCESS_KEY_ID=<aws_S3_key_ID>
REACT_APP_AWS_SECRET_KEY=<aws_S3_secret_key>
REACT_APP_AWS_S3_BUCKET_NAME=<aws_s3_bucket_name>
```

Finalmente, correr la aplicación:
``` npm start ```
