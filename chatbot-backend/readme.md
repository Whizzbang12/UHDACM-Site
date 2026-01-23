# Chatbot Backend  

This is the backend for the chatbot application. Follow the steps below to set up and run the project.  

## Installation  

1. Clone the repository to your local machine.  
2. Navigate to the project directory.  
3. Install the required dependencies:  

  ```bash  
  npm install  
  ```  

## Running the Chroma Server  

Start the Chroma server by running the following command:  

```bash  
npm run chroma-server  
```  

## Running the Ingester  

To add context to the chatbot, run the ingester with the `input.txt` file:  

```bash  
npm run ingestTest  
```  

## Running the Server  

Finally, start the backend server:  

```bash  
npm run dev  
```  

Your chatbot backend should now be up and running!