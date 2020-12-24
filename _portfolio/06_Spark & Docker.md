---
layout: single
title: "Data Pipeline"
excerpt: "Streaming Data Pipeline with Kafka, Flask, Spark, Hadoop & Presto"
header:
  teaser: assets/images/spark_docker.jpg
---

# Streaming Data Pipeline with Kafka, Flask, Spark, Hadoop & Presto

## Overview

This project is based on the idea of collecting events from a restaurant app. The app allows a user to create a profile, login, search for menus and then order them from restaurants who will deliver them.  

This analysis looks at user adoption with the goal of improving use of the app by examining  

- When people login and use the app
- What kind of menus they search for
- What kinds of food are ordered
- What kinds of reviews are given  

The data pipeline uses the following tools:

- kafka to store topics
- flask to run a python web app (restaurant_api.py)
- bench to generate ~42,000 events
- spark streaming to read the events and store in hive
- hadoop (cloudera) as the distributed storage
- hive to store the table schemas
- presto to run queries    

The goal is to represent something approaching large volumes of usage. It takes approximately 5 minutes to generate ~42,000 events using Bench, running on a 2 VCPU server with 3.25 GB of memory.

## Generating Events
The overall system is designed to generate events that reflect real life usage, this is done using Bench and a web app written in python. Bench is used to call events with different query strings and with differing volumes, for example there are more calls to 3 star reviews than 5 star reviews. The python web app is designed to populate the same events with different weighted fields, e.g.

- Accepting different parameters on the query string (e.g. Type of food searched for)
- The field for capturing event date is weighted towards evenings and weekends
- the field for capturing whether a user used a coupon when ordering food is weighed towards the value "No"
- the same pool of userid's is randomly selected from to generate cross usage

## Files

|File Name                 | Description                                                                                      |
|--------------------------|--------------------------------------------------------------------------------------------------|
|scripts/setup.sh          |Creates topics in kafka, installs python module in mids, creates tables in hive                   |
|scripts/flask.sh          |Runs flask restaurant_api web app                                                                 |
|scripts/spark0.sh         |Runs spark streaming servive to collect general events                                            |
|scripts/spark1.sh         |Runs spark streaming servive to collect order specific events                                     |
|scripts/bench.sh          |Runs bench commands for multiple api calls (~42,000)                                              |
|scripts/bench1.sh         |Calls exactly one instance of each event - for testing only                                      |
|scripts/restaurant_api.py |Python script (app) to generate events, is run by flask. This is the menu app                     |
|instructions.md           |General Instructions to setup the pipeline (important parts are repeated in this file under Set Up|

## Set Up

Scripts have been created to make setup easier, however some use of docker is still required. All scripts are held in the scripts directory.

#### 1.Login in to the server and navigate to the project scripts directory

`cd ~/w205/project-3-SextonCJ/scripts`

#### 2. start docker cluster, after checking it is not actually running

```
docker-compose ps
docker-compose up -d
```

#### 3. Run the setup.sh script which creates the kafka events and installs libraries on the mids container for generating usernames

`./setup.sh`  

The setup.sh script runs the following commands:

```
docker-compose exec kafka kafka-topics --create --topic menu_app_events --partitions 1 --replication-factor 1 --if-not-exists --zookeeper zookeeper:32181  
docker-compose exec cloudera hive -f /w205/project-3-SextonCJ/scripts/create_tables.sql  
docker-compose exec mids pip install random-username  
```  

The create_tables.sql script creates the external tables in hive that will be populated by the spark streaming scripts and then accessed by Presto at the end of the pipeline.  

Once setup is complete, the app is run against a set of test data, spark streaming is used to capture the events and write to a parquet file on hdfs. Again scripts have been written to make the running of these services easier. Using tmux or separate console windows, the following services need to be run in order and concurrently.   

```
./flask.sh
./spark0.sh
./spark1.sh
./bench.sh
```

##### ./flash.sh - runs the command to spin up a flask app server running the restaurant_api.py file
`docker-compose exec mids env FLASK_APP=/w205/project-3-SextonCJ/scripts/restaurant_api.py flask run --host 0.0.0.0`  

#### ./spark0.sh and spark1.sh - run the spark scripts which read in events from kafka and write (append) to a parquet file on cloudera  
There are two spark scripts as there are two distinct schemas (and hive tables) being written to. Each script can be run independently and will listen for the same topic but filtering for the different event types. This is an area that could potentially be refactored where there is only one streaming service, or there are different kafka topics listening for different event structures.

#### ./bench.sh - runs the bench commands to call the restaurant_api. These are logged to kafka, read by spark streaming and later queried in Presto.  
The restaurant_api.py app has been written so that some calls take arguments from the query string, whereas others do not. Examples of bench commands from the bench.sh script are given below:  

```
docker-compose exec mids ab -n 8291 -H "Host: user1.comcast.com"  http://localhost:5000/login0
docker-compose exec mids ab -n 367 -H "Host: user1.comcast.com"  http://localhost:5000/create_profile
docker-compose exec mids ab -n 2125 -H "Host: user1.comcast.com"  http://localhost:5000/menu_search?menu=Mexican
```

## Presto
Once the bench script has completed, all events will have been stored in parquet files in cloudera and can be read from Presto.  

`docker-compose exec presto presto --server presto:8080 --catalog hive --schema default`  

Once in presto queries will be written. The Report.md file describes this analysis

## Instructions

Follow the steps below to setup the project for data gathering and querying

### Step 1: Start docker cluster
```
docker-compose up -d
```

### Step 2: Run Setup

This script initializes a few modules that need to be run before we begin broadcasting/gathering data. This includes creating our topic, creating tables in hive, and installing a module for creating usernames

```
./setup.sh
```

### Step 3: Broadcasting and Gathering Data

This step may require either starting 4 terminals, or using `tmux` to have 4 windows in parallel. The following scripts should be run in the order they are listed


#### Session 1 - flask.sh

This file runs the web server

```
./flask.sh
```

####  Session 2 - bench.sh

This script runs each event. While you can run `bench_1.sh` to test the functionality of this step, `bench.sh` will run 1000s of events. It will take roughly 5 minutes for `bench.sh` to generate all 42,452 events

```
./bench.sh
```

#### Sessions 3 and 4 - spark0.sh and spark1.sh

These two spark streaming scripts should run in parallel and will store the `menu_app_events` and `menu_app_orders` events

```
./spark0.sh
./spark1.sh
```
""

### Step 4: Querying the data

Once these steps are done, the data is ready to be queried and viewed. We do this through presto. In a new window, run the following


```
docker-compose exec presto presto --server presto:8080 --catalog hive --schema default
```

The tables should then be ready to be viewed and queried. Run the following simple queries to see the results:
```
show tables;
select count(*) from menu_app_events;
select * from menu_app_events limit 5;

select count(*) from menu_app_orders;
select * from menu_app_orders limit 5;
```

- press q to quit the query


#### Optional - Querying Data Using Jupyter with Spark

While we made our queries using Presto, you can also do this using Jupyter with Spark


First, create a softlink in spark directory so we can easily navigate around without copying files

```
docker-compose exec spark bash
ln -s /w205/project-3-SextonCJ/ mydir
exit
```

This creats a link to your directory on the spark image - so when you are in jupyter, as long as you create your notebook in mydir it will always save to mapped drive in w205


#### Start Jupyter Notebook in Spark
```
docker-compose exec spark env PYSPARK_DRIVER_PYTHON=jupyter PYSPARK_DRIVER_PYTHON_OPTS='notebook --no-browser --port 9999 --ip 0.0.0.0 --allow-root' pyspark
```

In your browser, replace ip with your ip, and the token with what was provided

```
http://<your>.<four>.<digit>.<ip>:9999/?token=05aa56554d9d0e0f45cadeec537bf1b5fcbc6b51076349e7
```

After this is done, open a new notebook and run some queries. Below are some samples:

```
# read the data files and register as tables so can do SQL
events = spark.read.parquet('/tmp/menu_app_events')
events.registerTempTable('events')
orders = spark.read.parquet('/tmp/menu_app_orders')
orders.registerTempTable('orders')
```

```
spark.sql("describe events").show()
spark.sql("select event_type, description from events group by event_type, description").show()
```

```
spark.sql("describe orders").show()
spark.sql("select event_type, description from orders group by event_type, description").show()
```

```
spark.sql("select event_type, event_timestamp, description, coupon, price from orders where description = 'Lebanese'").show()
```

Alternatively, you can write files to your local machine if you prefer to run locally.


```
df_events = events.toPandas()
df_events.to_csv (r'/w205/project-3-SextonCJ/data/events.csv', index = None, header=True)
```

```
df_orders = orders.toPandas()
df_orders.to_csv (r'/w205/project-3-SextonCJ/data/orders.csv', index = None, header=True)
```
