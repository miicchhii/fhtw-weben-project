# fhtw-weben-project

## webshop name: BytePort

Welcome to BytePort, your ultimate destination for cutting-edge computer hardware and accessories. Whether you're
looking for powerful processors, high-performance GPUs, or innovative peripherals, we provide top-tier technology at
competitive prices.

## Starting the Application:

### Backend:

run **compose up -d /docker-compose.yml**

wait for the Database to start, then run **MainApp.java**

Backend will be available on port 8080 (http://localhost:8080)
phpmyadmin is available on port 1234 (http://localhost:1234)

#### Demo Data

When the backend is started, demo data is created.
See src/main/java/at.technikumwien.websc.TransactionalDataInitializer.java

This demo data includes an admin account.
To log in, use **admin/admin**
or **customer/customer** for a non-admin account.

### Frontend:

run **compose up -d /frontend/docker-compose.yml**

Frontend (Webshop) will be available on port 1235 (http://localhost:1235)
