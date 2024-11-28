docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4.0-management

docker run --name lyrebird-mysql -e MYSQL_ROOT_PASSWORD=lyrebirdrocks -p 3306:3306 -d mysql:8.0