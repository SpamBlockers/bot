FROM gitpod/workspace-full

USER gitpod

## Move everything to SpamBlockersBot
COPY . /workspace/SpamBlockersBot
WORKDIR /workspace/SpamBlockersBot

## Install KubeCLI
RUN sudo curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
RUN sudo chmod +x ./kubectl
RUN sudo mv ./kubectl /usr/local/bin/kubectl

## Next, install
RUN curl https://get.okteto.com -sSfL | sh

