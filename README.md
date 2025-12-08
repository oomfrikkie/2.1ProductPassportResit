# 2.1ProductPassportResitSETUP

Open the project directory in your terminal.

Run the setup script:

bash setup.sh

This script will:

install all required Node.js dependencies

build the TypeScript source files

start the full Docker environment (MQTT broker, MariaDB, Postgres, Adminer, and the TypeScript tracking service)

show the tracking service logs so you can confirm everything is running

Once the setup script finishes, the system is fully started and ready to receive tracking events.

HOW TO RUN AND TEST THE SYSTEM

After the setup is complete, open a new terminal window in the same project directory.

Run the test script:

./test.sh

This script simulates multiple material scans.
Each scan is sent as an MQTT message to the topic:
ssm/tracking/test

The TypeScript service receives each message and stores the event in the MariaDB database inside the material_event table.

HOW TO VIEW STORED EVENTS

Open Adminer in your browser:

http://localhost:8080

Log in using these credentials:
System: MariaDB
Server: mariadb
Username: root
Password: admin
Database: producttracking

Select the table material_event to view the stored tracking events.

HOW TO VIEW UNS OUTPUT MESSAGES

The TypeScript bridge republishes each scan event to a UNS topic in the format:
uns/product/[product_id]

To view these UNS messages live:

Enter the MQTT broker container:

docker exec -it productpassportresit-mqtt-1 sh

Subscribe to all UNS messages:

mosquitto_sub -t "uns/#"

Any time the tracking service processes an event, you will see the UNS message appear in this subscriber.

If the terminal shows a blank line and waits, that means it is actively listening.
As soon as a new event is published, it will appear.