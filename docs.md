[Stripe] Listen and process webhooks locally
docker run --rm -it stripe/stripe-cli:latest --api-key << sk_something >> listen --forward-to http://192.168.0.119:3000/api/webhooks

docker run --rm -it -p 5432:5432 -e POSTGRES_USER=default -e POSTGRES_DB=verceldb -e POSTGRES_PASSWORD=5SszM6NhOajQ postgres:16.6

psql -h localhost -U default -W -d verceldb -f backup.sql
