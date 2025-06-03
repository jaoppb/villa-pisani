FROM localstack/localstack:latest

RUN apt install -y dos2unix && \
	rm -rf /var/lib/apt/*

RUN mkdir -p /etc/localstack/init/ready.d
COPY ./scripts/* /etc/localstack/init/ready.d/
RUN dos2unix /etc/localstack/init/ready.d/*
