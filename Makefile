up:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

up-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

down: 
	docker-compose down