FROM nginx:alpine

COPY static /usr/share/nginx/html
COPY js /usr/share/nginx/html/js
COPY css /usr/share/nginx/html/css

COPY nginx.k8s.conf /etc/nginx/conf.d/default.conf
