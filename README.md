# TheVault

 # Fullstack App
Vue + Express + PostgreSQL
<p align="center"> <img src="https://img.shields.io/badge/Vue-3.x-42b883?style=for-the-badge&logo=vue.js&logoColor=white" /> <img src="https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white" /> <img src="https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql&logoColor=white" /> <img src="https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white" /> </p>
Descripción General

Este proyecto implementa una arquitectura fullstack moderna utilizando:

 - Frontend: Vue.js
   
   
 - Backend: Express.js

   

 - Base de datos: PostgreSQL

La combinación de estas tecnologías permite desarrollar aplicaciones web escalables, mantenibles y con alto rendimiento.


## Justificación de la Stack

### ▸ Vue.js — Capa de Presentación

-   Arquitectura basada en componentes
    
-   Sistema de reactividad eficiente
    
-   Organización clara del código
    
-   Excelente rendimiento en SPA
    

**Ventaja principal:**  
Permite construir interfaces dinámicas, modulares y fáciles de mantener.


### ▸ Express.js — Capa de Lógica de Negocio

-   Framework minimalista y flexible
    
-   Desarrollo sencillo de APIs REST
    
-   Arquitectura basada en middlewares
    
-   Uso de JavaScript tanto en frontend como backend
    

**Ventaja principal:**  
Facilita la creación de un backend estructurado y escalable.


### ▸ PostgreSQL — Capa de Persistencia

-   Cumplimiento de propiedades ACID
    
-   Modelado relacional avanzado
    
-   Integridad referencial mediante claves foráneas
    
-   Soporte para datos en formato JSON
    

**Ventaja principal:**  
Garantiza consistencia, seguridad y estabilidad en el manejo de datos.

## Ventajas Arquitectónicas

-   Separación clara de responsabilidades (Cliente / Servidor / Base de Datos)
    
-   Uso de un mismo lenguaje en todo el stack (JavaScript)
    
-   Comunicación eficiente mediante API REST
    
-   Alta integridad y confiabilidad de los datos
  ## Diagrama de arquitectura:
  
  
  <img width="974" height="732" alt="image" src="https://github.com/user-attachments/assets/89347ab5-488f-4c77-adc3-eb9a8dc79a83" />


# USO DEL SITIO

**Pantalla inicial:** Inicio de sesión con campos de email y contraseña. En caso de no tener cuenta lleva enlace a la pantalla de creación de cuentas.


<img width="1833" height="930" alt="image" src="https://github.com/user-attachments/assets/74e2aa95-a691-400b-a6ad-1bd6aaa352bd" />

**Pantalla de creación de cuenta:** Campos para Email y contraseña, más campo de confirmación de contraseña y la creación de cuenta.

<img width="1823" height="971" alt="image" src="https://github.com/user-attachments/assets/354e2380-2c50-4bf2-bd7e-a6e1183e447b" />

**Pantalla de cuenta iniciada:** Permite la creación de credenciales y ver las existentes en la cuenta. Permite Ver, Editar y Eliminar las credenciales.

<img width="1879" height="917" alt="image" src="https://github.com/user-attachments/assets/03e51bf5-a4d3-455d-89d8-677bec0a8969" />

**Pantalla de ver credencial: ** Datos de la crdencial, se puede ver la contraseña si se desea.

<img width="1811" height="917" alt="image" src="https://github.com/user-attachments/assets/8996b119-5821-4b19-9503-80d2204223a3" />

**Pantalla de nueva credencial: ** Permite la creación de una credencial del servicio que se desea. Pide la url del servicio, la contraseña y notas.

<img width="1866" height="952" alt="image" src="https://github.com/user-attachments/assets/f242e56a-d083-445c-a40e-9275dac7d31a" />


# Pasos para ejecutar la aplicacion (local)
## 1.- Levantamiento de la DB
Una vez dentro de pgAdming4, crear la base de datos "TheVault", y ejecutar el script TheVault/backend/src/DB/TheVault_create.sql para crear las tablas necesarias

## 2.- Levantamiento del Backend

En el .env, reemplazar los credenciales de acceso a la DB por los correspondientes al usuario de pgAdmin4
En la terminal, navegar hacia TheVault/backend/, y hacer uso de npm install para instalar las dependencias. Una vez finalizada la instalación, ejecutar npm run dev para finalizar el levantamiento del backend.

## 3.- Levantamiento del frontend

De manera similar, en la terminal, navegar hacia TheVault/frontend/TheVault, y hacer uso de npm install para instalar las dependencias. Una vez finalizada la instalación, ejecutar npm run dev para finalizar el levantamiento del frontend. Al usar vite, se recure al puerto 5173 para hacer uso de la aplicación.

En caso de tener algun error con la instalación de las dependencias, instalar npm install axios manualmente.
