# Romanian IT Companies Dashboard

## Overview

The **Romanian IT Companies Dashboard** is a web application designed to display, analyze, and provide detailed insights into the IT companies operating in Romania. This project provides a user-friendly and interactive dashboard that helps users explore data about companies in the Romanian IT sector. The dashboard enables users to apply various filters, search for specific companies, and view detailed statistics on company performance and market trends.

### Why I Built This Application

While there are several websites that offer information about IT companies in Romania, many of them require paid subscriptions to access valuable data or to download reports. I created this application to provide an accessible, free, and easy-to-use platform that allows users to explore and analyze publicly available datasets from data.gov. By parsing and joining these datasets, I created a tool for gaining insights into the Romanian IT sector.

## Features

- **Interactive Data Table**: Sortable columns for quick access to company data.
- **Advanced Filtering**: Apply multiple filters to search for companies based on specific criteria.
- **Company Statistics**: View detailed information about a company’s performance, including financials and assets.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Dark Mode Support**: For a comfortable viewing experience in low-light environments.
- **Pagination**: Efficient browsing through large datasets with pagination.
- **Customizable Views**: Toggle columns to display only the most relevant data.

## Technology Stack

- **Frontend**:
  - **React (v18+)**: JavaScript library for building user interfaces.
  - **TypeScript**: A typed superset of JavaScript that enhances code quality and maintainability.
  - **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
  - **shadcn/ui**: Reusable components built with Radix UI and Tailwind CSS.
  - **Tanstack Table**: Headless UI for building powerful tables and data grids.
  - **Lucide React**: Icon toolkit providing beautiful and consistent icons for the app.

- **Backend**:
  - **Node.js**: JavaScript runtime for building the backend.
  - **TypeScript**: Provides type safety and better developer experience on the server side.
  - **SQLite**: Lightweight, serverless SQL database for storing company data.
  - **Express.js**: Web framework for building RESTful APIs.

## Database Schema

The application stores and processes company data in an SQLite database. The **Companies** table is structured to store various financial and contact-related details for each company in Romania's IT sector. Below is an explanation of the key columns and their meaning:

### `Companies` Table

| Column Name                       | Data Type  | Description |
|------------------------------------|------------|-------------|
| **cui**                            | `STRING`   | The unique identifier (CUI - Cod Unic de Identificare) for the company. This is the primary key. |
| **caen**                           | `STRING`   | The CAEN code (Codul Activităților Economice din România) that categorizes the company based on its business activity. |
| **active_imobilizate**             | `INTEGER`  | The company's fixed assets (immobilized assets). |
| **active_circulante**              | `INTEGER`  | The company's current assets (circulating assets). |
| **stocuri**                        | `INTEGER`  | The company's inventory (stocks). |
| **creante**                        | `INTEGER`  | The company's receivables. |
| **casa_si_conturi_la_banci**       | `INTEGER`  | The company's cash and bank accounts. |
| **cheltuieli_in_avans**            | `INTEGER`  | The company's prepaid expenses. |
| **datorii**                        | `INTEGER`  | The company's debts. |
| **venituri_in_avans**              | `INTEGER`  | The company's advance revenue. |
| **provizioane**                    | `INTEGER`  | The company's provisions (reserves). |
| **capitaluri**                     | `INTEGER`  | The company's capital. |
| **capital_subcris_varsat**         | `INTEGER`  | The subscribed and paid-up capital. |
| **patrimoniul_regiei**             | `INTEGER`  | The company's heritage or assets under the management of the entity. |
| **cifra_de_afaceri_neta**          | `INTEGER`  | The net turnover (revenue) of the company. |
| **venituri_totale**                | `INTEGER`  | The total revenues of the company. |
| **cheltuieli_totale**              | `INTEGER`  | The total expenses of the company. |
| **profit_brut**                    | `INTEGER`  | The gross profit of the company. |
| **pierdere_bruta**                 | `INTEGER`  | The gross loss of the company. |
| **profit_net**                     | `INTEGER`  | The net profit of the company. |
| **pierdere_neta**                  | `INTEGER`  | The net loss of the company. |
| **numar_mediu_de_salariati**       | `INTEGER`  | The average number of employees in the company. |
| **denumire**                       | `STRING`   | The name of the company. |
| **telefon**                        | `STRING`   | The company's phone number. |
| **judet**                          | `STRING`   | The county or region in Romania where the company is located. |

### Example Data

Here’s an example of what a record in the `Companies` table might look like:

| cui       | caen  | active_imobilizate | active_circulante | stocuri | creante | casa_si_conturi_la_banci | ... | profit_net | denumire          | telefon  | judet       |
|-----------|-------|--------------------|-------------------|---------|---------|-------------------------|-----|------------|--------------------|----------|-------------|
| 12345678  | 6201  | 500000             | 300000            | 150000  | 50000   | 100000                  | ... | 200000     | Tech Company       | 021234567 | bucuresti   |
| 87654321  | 6202  | 300000             | 450000            | 100000  | 70000   | 150000                  | ... | 150000     | Software Solutions | 021765432 | cluj        |

## API Endpoints

The backend exposes two main routes for retrieving data:

1. **Get Company by CUI**:  
   - **Route**: `GET /api/companies/:cui`
   - **Description**: Fetch details about a company using its unique identification number (CUI).
   - **Example Request**:
     ```http
     GET /api/companies/12345678
     ```
   - **Example Response**:
     ```json
     {
       "status": "success",
       "data": {
         "cui": "12345678",
         "denumire": "Tech Company",
         "capitaluri": 1000000,
         "profit_net": 200000,
         "venituri_totale": 5000000,
         ...
       }
     }
     ```

2. **Get Companies with Filters**:
   - **Route**: `GET /api/companies`
   - **Description**: Retrieve a list of companies with customizable filters. Filters can be applied to various company attributes, such as revenue, assets, or location.
   - **Example Request**:
     ```http
     GET /api/companies?capitaluri=1000000&profit_net=50000&judet=bucuresti&limit=5&offset=0
     ```
   - **Example Response**:
     ```json
     {
       "status": "success",
       "data": [
         {
           "cui": "12345678",
           "denumire": "Tech Company",
           "capitaluri": 1000000,
           "profit_net": 50000,
           "judet": "bucuresti",
           ...
         },
         {
           "cui": "87654321",
           "denumire": "Software Solutions",
           "capitaluri": 2000000,
           "profit_net": 150000,
           "judet": "bucuresti",
           ...
         },
         ...
       ],
       "pagination": {
         "currentPage": 1,
         "itemsPerPage": 5,
         "totalItems": 20,
         "totalPages": 4
       }
     }
     ```
## Hosting

Both the frontend and backend are hosted on an **AWS EC2** instance. The frontend is served by **Nginx**, which acts as a reverse proxy to route requests to either the frontend or the backend.
Visit the [website](http://35.158.2.69/)
