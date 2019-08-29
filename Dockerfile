FROM nginx:alpine
LABEL author="Niruban Kandasamy"
COPY ./dist/record-linking-app /usr/share/nginx/html
EXPOSE 4200
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
