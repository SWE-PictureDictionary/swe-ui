FROM nginx:alpine

COPY static /usr/share/nginx/html

COPY nginx.k8s.conf /etc/nginx/conf.d/default.conf