IMAGE_NAME := kamranahmed/local-ses
IMAGE_TAG := latest

.PHONY: build push run

build:
	@docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .

push:
	@docker push $(IMAGE_NAME):$(IMAGE_TAG)

run:
	@docker run -d --name local-ses -p 8282:8282 $(IMAGE_NAME):$(IMAGE_TAG)
