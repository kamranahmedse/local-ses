IMAGE_NAME := kamranahmed/local-ses
IMAGE_TAG := latest
PLATFORMS := linux/amd64,linux/arm64,linux/arm/v7

.PHONY: build run

build:
	@docker buildx create --use
	@docker buildx build --platform $(PLATFORMS) -t $(IMAGE_NAME):$(IMAGE_TAG) --push .

run:
	@docker run -d --name local-ses -p 8282:8282 $(IMAGE_NAME):$(IMAGE_TAG)
