# Setup

1. Run rabbitmq
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4.0-management

2. Run mysql
docker run --name lyrebird-mysql -e MYSQL_ROOT_PASSWORD=lyrebirdrocks -p 3306:3306 -d mysql:8.0

3. copy `.env.sample` to `.env`. Fill in `OPENAI_API_KEY`. If no `OPENAI_API_KEY`, fill in anything random and set `MOCK_OPENAI` to true

4. npm run i

5. npm run dev

# Note
Tested on node v18.17.0
