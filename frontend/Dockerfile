# syntax=docker/dockerfile:1

FROM node:22-alpine AS development

WORKDIR /project

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Set host to allow external access
ENV HOST=0.0.0.0

# Expose the default Vite port
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

FROM development as dev-envs
RUN <<EOF
apk update
apk add git
EOF

RUN <<EOF
addgroup -S docker
adduser -S --shell /bin/bash --ingroup docker vscode
EOF

# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /
CMD ["npm", "run", "dev", "--", "--host"]
