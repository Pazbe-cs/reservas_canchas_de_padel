 Sistema de Reservas de Canchas de Pádel

Este proyecto consiste en una aplicación completa para gestionar reservas de canchas de pádel.  
Incluye un backend en Java con Maven y un frontend en Angular, organizados de manera modular dentro del mismo repositorio.

---

 Estructura del Proyecto

reservas_canchas_de_padel/
├── backend/ → API REST en Java + Maven
│ ├── src/
│ ├── pom.xml
│ └── target/
└── frontend/ → Aplicación web en Angular
├── src/
├── angular.json
└── package.json
Antes de comenzar utilice:

SDKMAN (WSL/Ubuntu) → para manejar versiones de Java

Maven (Windows) → para compilar el backend

NVM (Windows) → para manejar versiones de Node.js

Angular CLI (Windows) → para el frontend




1. INSTALACIÓN DE SDKMAN (WSL)


curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
sdk version

 Instalar Java LTS
sdk install java 21.0.3-tem
sdk use java 21.0.3-tem
java -version



2. VERIFICACIÓN DE MAVEN (WINDOWS)


mvn -v



 3. CREACIÓN DEL PROYECTO BACKEND (MAVEN)


mkdir entorno-backend-java
cd entorno-backend-java

mvn archetype:generate -DgroupId=com.padel.backend \
-DartifactId=backend \
-DarchetypeArtifactId=maven-archetype-quickstart \
-DinteractiveMode=false



 4. SUBIR BACKEND A GITHUB


cd backend
git init
git branch -M main
git remote add origin https://github.com/Pazbe-cs/reservas_canchas_de_padel.git
git add .
git commit -m "Backend inicial en Java con Maven"
git push -u origin main



 5. INSTALACIÓN NVM + NODE LTS (WINDOWS)


nvm version
nvm root

nvm install lts
nvm use lts

node -v
npm -v



 6. INSTALACIÓN ANGULAR CLI


npm install -g @angular/cli
ng version



7. CREACIÓN DEL PROYECTO FRONTEND


cd C:/Users/ACER/Documents/reservas_canchas_de_padel
ng new frontend

cd frontend
ng serve



 8.FRONTEND A GITHUB

cd C:/Users/ACER/Documents/reservas_canchas_de_padel
git add .
git commit -m "Agrego frontend Angular"
git push


 9. DOCKER 


docker --version
docker run hello-world




Docker Desktop (Windows) → para la ejecución de contenedores
