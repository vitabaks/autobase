# First stage: Install build-time dependencies
FROM ubuntu:noble as builder

# hadolint ignore=DL3002
USER root

# Copy Python version config file
COPY .config/python_version.config /tmp/

# Set a variable for the npm version
ARG NPM_VERSION=11.2.0
# Set a variable for the ungit version
ARG UNGIT_VERSION=1.5.28
# Set a variable for the prettier version
ARG PRETTIER_VERSION=3.5.3
# Set a variable for the editorconfig-checker version
ARG EDITORCONFIG_CHECKER_VERSION=3.2.0

# Update system and install packages
# hadolint ignore=DL3008,DL3013,DL3009
RUN PYTHON_VERSION=$(cut -d '=' -f 2 /tmp/python_version.config) \
    && apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y --no-install-recommends \
        bash-completion \
        ca-certificates \
        curl \
        git \
        git-lfs \
        gnupg \
        htop \
        iproute2 \
        lsb-release \
        make \
        nano \
        python3-pip \
        "python${PYTHON_VERSION}" \
        "python${PYTHON_VERSION}-venv" \
        sudo \
        tree \
        vim \
        wget \
      && python3 -m pip install --no-cache-dir virtualenv --break-system-packages

# Install Docker
FROM builder as docker-installer

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
# hadolint ignore=DL3008,DL3009
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null \
    && apt-get update \
    && apt-get install -y --no-install-recommends docker-ce docker-ce-cli containerd.io

# Install npm, ungit, prettier, editorconfig-checker, and sql-formatter
FROM docker-installer as npm-installer

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
# hadolint ignore=DL3008
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get install -y --no-install-recommends nodejs \
  && npm install -g "npm@${NPM_VERSION}" \
  && npm install -g \
  "ungit@${UNGIT_VERSION}" \
  "prettier@${PRETTIER_VERSION}" \
  "editorconfig-checker@${EDITORCONFIG_CHECKER_VERSION}" \
  "sql-formatter@latest"

# Cleanup
FROM npm-installer as cleanup

RUN apt-get clean && rm -rf /var/lib/apt/lists/* tmp/* 

# Final stage: Setup final image and user
FROM scratch

COPY --from=cleanup / /

# Create the gitpod user. UID must be 33333.
RUN useradd -l -u 33333 -G sudo -md /home/gitpod -s /bin/bash -p gitpod gitpod

USER gitpod
