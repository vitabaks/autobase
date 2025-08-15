# Autobase Console UI

The UI part of autobase console. This project provides a user-friendly web interface for managing, monitoring, and configuring Postgres clusters.

## Features

- **Cluster management**: Create Postgres clusters for multiple cloud providers or your own machines.
- **Cluster overview**: View general information and status of Postgres cluster.
- **Operations**: View cluster operations and deployment logs.
- **Projects**: Create multiple projects with different clusters.
- **Environments**: Create multiple environments for clusters.
- **Settings**: Use proxy servers to deploy clusters (optional).
- **Secrets**: Easily manage multiple credentials, including cloud secrets, SSH keys, and passwords.

## Installation

To run this project locally, follow these steps:

1. **Clone repository**

```
git clone https://github.com/vitabaks/autobase.git
cd autobase/console/ui
```

2. **Install dependencies**

```yarn install```

3. **Start development server**

```yarn run dev```

## Usage

### Running the App in Development Mode

1. Ensure you have installed all dependencies with ```yarn install```.
2. Start the development server with ```yarn run dev```.
3. Browser with app should open automatically. If this didn't happen open your browser and navigate
   to http://localhost:5173.

### Building for Production

To create a production build:

```yarn run build```

The optimized build will be output to the `dist` folder. You can then serve this with any static server.

## Technology Stack

**UI:**

- React
- Redux Toolkit (RTK Query for data fetching)
- React Router v6
- Vite (development and build tool)
- Material UI (UI kit)
- Material React Table V2
- React-toastify

**Deployment:**

- Docker (included Dockerfile for quick deployment)
- Nginx (project configuration included)

## Configuration

There are several env variables that configure UI:

| KEY                                          | DEFAULT                      | DESCRIPTION                                                 |
|----------------------------------------------|------------------------------|-------------------------------------------------------------|
| PG_CONSOLE_AUTHORIZATION_TOKEN               | auth_token                   | Reference auth token that will be used for login.           |
| PG_CONSOLE_CLUSTERS_POLLING_INTERVAL         | 60000                        | Clusters table refresh interval in milliseconds.            |
| PG_CONSOLE_CLUSTER_OVERVIEW_POLLING_INTERVAL | 60000                        | Cluster overview refresh interval in milliseconds.          |
| PG_CONSOLE_OPERATIONS_POLLING_INTERVAL       | 60000                        | Operations table refresh interval in milliseconds.          |
| PG_CONSOLE_OPERATION_LOGS_POLLING_INTERVAL   | 10000                        | Operation logs refresh interval in milliseconds.            |
| PG_CONSOLE_API_HOST                          | localhost                    | Backend API address (used by nginx reverse proxy).          |
| PG_CONSOLE_API_PORT                          | 8080                         | Backend API port.                                           |

The UI communicates with the API using the relative path /api/v1 through the Nginx reverse proxy host specified by PG_CONSOLE_API_HOST. If needed, you can override this by setting the PG_CONSOLE_API_URL variable.

## Architecture

UI uses [Feature-Sliced Design](https://feature-sliced.design/) v2 approach to implement architecture.
This design pattern divides the application into distinct layers and slices, each with a specific role and
responsibility, to promote isolation, reusability, and easy maintenance.

### Feature-Sliced Design Overview

#### Layers

1. **App Layer**

   - Description: This is the top-level layer, responsible for initializing the application, setting up providers (like
     routers, states, etc.), and global styles.
   - Contents:
   - App: Main application component that integrates all providers and initializes the app.
   - providers: Context providers such as Redux Provider, Router, Theme, etc.
   - styles: Global styles and theming.

2. **Pages Layer**

   - Description: Represents the application screens or pages. Each page can consist of multiple features and/or entities.
   - Contents: Page components like AddCluster, Login, 404, etc.

3. **Features Layer**

   - Description: This layer contains interactive components such as buttons, modals, etc.
   - Contents: Feature components like AddSecret, LogoutButton, OperationsTableRowActions, etc.

4. **Entities Layer**

   - Description: Contains core business entities of the application. Additionally, reusable form parts are also made
     entities.
   - Contents: Entities like SidebarItem, SecretFormBlock, etc.

5. **Shared Layer**

   - Description: This is the foundational layer. It includes utilities, shared components, constants, and other reusable
     elements that can be used across features, entities, or pages.
   - Contents: Common components (CopyIcon, DefaultTable, Spinner), constants and types, utility functions.
