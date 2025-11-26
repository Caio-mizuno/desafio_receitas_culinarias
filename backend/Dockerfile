# ---------------------------------------------- Build Time Arguments --------------------------------------------------
  ARG NODE_VERSION="22.7"
  ARG NGINX_VERSION="1.21"
  ARG APP_BASE_DIR="."
  
  # ======================================================================================================================
  #                                                   --- Base ---
  # ---------------  This stage install needed extenstions, plugins and add all needed configurations  -------------------
  # ======================================================================================================================
  
  FROM node:${NODE_VERSION}-alpine AS base
  
  # Required Args (inherited from start of file, or passed at build)
  ARG APP_BASE_DIR
  
  # Maintainer label
  LABEL maintainer="sherifabdlnaby@gmail.com"
  
  # Set SHELL flags for RUN commands to allow -e and pipefail
  SHELL ["/bin/ash", "-eo", "pipefail", "-c"]
  
  # ------------------------------------- Install Packages Needed Inside Base Image --------------------------------------
  
  RUN RUNTIME_DEPS="tini fcgi"; \
    SECURITY_UPGRADES="curl"; \
    apk add --no-cache --upgrade ${RUNTIME_DEPS} ${SECURITY_UPGRADES}
  
  
  RUN apk add --no-cache --virtual .build-deps \
    libzip-dev    \
    icu-dev       \
    libxml2-dev   \
    tzdata   
  
  
  RUN apk --no-cache add gcc musl-dev curl libaio libnsl libc6-compat
  
  
  RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
    curl \
    libmemcached-dev \
    zlib-dev \
    postgresql-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    oniguruma-dev \
    freetype-dev \
    openssl-dev \
    libmcrypt-dev \
    zip \
    unzip \
    build-base \
    mariadb-dev \
    libaio \
    libzip-dev \
    supervisor \
    dcron \
    && rm -rf /var/cache/apk/*
  
  # ------------------------------------------------- Permissions --------------------------------------------------------
  
  # Set working directory
  WORKDIR /app
  
  # Copy dependencies files
  # COPY ${APP_BASE_DIR}/package.json ${APP_BASE_DIR}/package-lock.json ./
  
  # Install dependencies
  # RUN npm install
  
  # Copy application files
  COPY ${APP_BASE_DIR} .
  
  # ----------------------------------------------------- MISC -----------------------------------------------------------
  
  
  # ---------------------------------------------------- Scripts ---------------------------------------------------------
  # ======================================================================================================================
  # ==============================================  PRODUCTION IMAGE  ====================================================
  #                                                   --- PROD ---
  # ======================================================================================================================
  
  FROM base AS app
  
  ARG APP_BASE_DIR

  # Switch root to install stuff
  USER root
  
  # For Composer Installs
  RUN apk --no-cache add git openssh bash supervisor;
  COPY ${APP_BASE_DIR} .
  RUN rm -rf node_modules
  RUN rm package-lock.json
  COPY package.json package-lock.json ./
  # Install Nest
  RUN npm install -g @nestjs/cli  
  
  # Install all dependencies
  RUN npm install 
  
  COPY docker/supervisor/supervisord.conf \
  # to
  /usr/local/bin/
  
  RUN mkdir -p /var/log/nestjs && \
  chown -R root:root /var/log/nestjs && \
  chmod -R 755 /var/log/nestjs
  
  COPY ./docker/run.sh /usr/local/bin/run.sh
  RUN chmod +x /usr/local/bin/run.sh
  
  RUN npm run build 
  EXPOSE 3000
  # CMD ["/usr/local/bin/run.sh" ]
  CMD ["npm", "run", "build"]


  # ======================================================================================================================
  # ==============================================  PRODUCTION IMAGE  ====================================================
  #                                                   --- Dev ---
  # ======================================================================================================================
  
  FROM base as app-dev
  
  ENV APP_ENV dev
  ENV APP_DEBUG 1
  
  # Switch root to install stuff
  USER root
  
  # For Composer Installs
  RUN apk --no-cache add git openssh bash supervisor;
  # Copy application files
  COPY ${APP_BASE_DIR} .
  RUN rm -rf node_modules
  RUN rm package-lock.json
  COPY package.json package-lock.json ./
  # Install Nest
  RUN npm install -g @nestjs/cli  
  
  # Install all dependencies
  RUN npm install 
  
  
  COPY docker/supervisor/supervisord.conf \
    # to
    /usr/local/bin/
  
  RUN mkdir -p /var/log/nestjs && \
    chown -R root:root /var/log/nestjs && \
    chmod -R 755 /var/log/nestjs
  
  COPY ./docker/run.sh /usr/local/bin/run.sh
  RUN chmod +x /usr/local/bin/run.sh
  
  EXPOSE 3000
  # CMD ["/usr/local/bin/run.sh" ]
  CMD ["npm", "run", "start:dev"]
  
  # ======================================================================================================================
  # ======================================================================================================================
  #                                                  --- NGINX ---
  # ======================================================================================================================
  # ======================================================================================================================
  FROM nginx:${NGINX_VERSION}-alpine AS nginx
  ARG APP_BASE_DIR
  
  USER root
  
  RUN rm -rf /var/www/* /etc/nginx/conf.d/* && adduser -u 1011 -D -S -G www-data www-data
  
  COPY docker/nginx/nginx-*   /usr/local/bin/
  COPY docker/nginx/nginx-entrypoint   /usr/local/bin/nginx-entrypoint
  COPY docker/nginx/          /etc/nginx/
  
  RUN chown -R www-data. /etc/nginx/ && chmod +x /usr/local/bin/nginx-*
  
  #ADD ${APP_BASE_DIR}/docker/logs/nginx /var/log/nginx
  
  ## Localhost is the sensible default assuming image run on a k8S Pod
  RUN touch /var/log/nginx/access.log \
    chown  www-data. /var/log/nginx/access.log && \
    chmod -R 775 /var/log/nginx/access.log
  
  RUN touch /var/log/nginx/error.log \
    chown  www-data. /var/log/nginx/error.log && \
    chmod -R 775 /var/log/nginx/error.log
  
  ###Ajustar aqui adicionado permissao do ususario www-data ao log
  RUN chown -R www-data. /var/log/nginx && chmod 775 /var/log/nginx
  
  ENV NESTJS_HOST "localhost"
  ENV NESTJS_PORT "3000"
  ENV NGINX_LOG_FORMAT "json"
  
  # For Documentation
  EXPOSE 8080
  
  # Add Healthcheck
  HEALTHCHECK CMD ["docker/nginx/nginx-healthcheck"]
  
  # Add Entrypoint
  ENTRYPOINT ["nginx-entrypoint"]
  
  # Switch User
  USER www-data
  
  # ======================================================================================================================
  #                                                 --- NGINX PROD ---
  # ======================================================================================================================
  
  FROM nginx AS web
  
  USER root
  
  RUN SECURITY_UPGRADES="curl"; \
    apk add --no-cache --upgrade ${SECURITY_UPGRADES}
  
  
  USER www-data
  
  # Copy Public folder + Assets that's going to be served from Nginx
  COPY --chown=www-data:www-data --from=app ./ /app/public
  COPY --chown=www-data:www-data docker/nginx/prod/*.conf   /etc/nginx/conf.d/
  
  
  # ======================================================================================================================
  #                                                 --- NGINX DEV ---
  # ======================================================================================================================
  FROM nginx AS web-dev
  
  ENV NGINX_LOG_FORMAT "combined"
  
  COPY --chown=www-data:www-data --from=app ./ /app/public
  COPY --chown=www-data:www-data docker/nginx/dev/*.conf   /etc/nginx/conf.d/
  COPY --chown=www-data:www-data docker/nginx/dev/certs/   /etc/nginx/certs/
  