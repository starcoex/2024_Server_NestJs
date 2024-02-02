FROM nginx:latest

COPY /path/to/nginx/nginx.conf /etc/nginx/nginx.conf
COPY /path/to/nginx/mime.types /etc/nginx/mime.types
COPY /path/to/nginx/conf.d/default.conf /etc/nginx/conf.d
EXPOSE 80

