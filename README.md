# UHD ACM Site
This repository contains the codebase for the UHD ACM website. It is organized as a monorepo.

## Code Stack
This is a monorepo, each folder will contain a different part of this project.

That said, each folder will also explain the techstack in their respective **readme**.

## Contributing<br/>
Fork the github repository, clone your fork locally, make changes, push them to your fork, submit your branch for pull.

[This video](https://www.youtube.com/watch?v=LSJMUqDDPJw) is a great overview of how to **fork -> clone -> edit -> push**.

> Note: modification is reserved for UHD ACM club members (and a few individuals)

## Monorepo Structure

Each directory in the monorepo represents a core part of the project. Refer to the respective `README.md` in each folder for detailed setup and usage instructions.

### ./cms
Backend powered by [Strapi](https://strapi.io/).  
Provides a headless CMS for dynamic content management, API endpoints, and webhook integration for the site and vector context manager.

### ./site
Frontend built with [Next.js](https://nextjs.org/).  
Fetches content from the CMS and renders the public-facing website. Supports live content updates via webhooks and API tokens.

### ./chatbot-backend
Node.js backend for the chatbot feature.  
Handles chatbot logic, integrates with ChromaDB for vector search, and ingests context from the CMS.

### ./vector-context-manager
Synchronizes CMS content into ChromaDB for advanced search and retrieval.  
Manages collection updates, ticketing, and webhook-based synchronization.

### ./shared
Contains shared types and utility functions used across multiple packages to ensure consistency and reduce code duplication.



## How to Run
The run scripts for each part of the project are located in their respective folder's **readme**. 

To run the entire project, ensure that all parts (e.g., `./cms`, `./site`, etc.) are running simultaneously.
