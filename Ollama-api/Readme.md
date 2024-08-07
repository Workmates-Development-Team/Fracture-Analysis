
## Installation

- Download ollama from https://ollama.com/download

- Download a model
  
  ```bash
  ollama run <model_name> (phi3, llama3.1)
  ```
  It will download the model (if not already downloaded)

- Create a virtual environment

```bash
python -m venv myenv
```
or 

```bash
python3 -m venv myenv
```

- Activate the environment

- in windows
```bash
myenv\Scripts\activate
```

- in linux
```bash
source myenv/bin/activate
```




### Requirements

- Python 3.7+
- Install requirements.txt
- ollama must be installed and you must download a model e.g. phi3, llama3.1 (as the model name will be an input in the code)


### Running the Application
use this command to run the python file 
```bash
python medi.py
```

```bash
python3 medi.py
```


## API Endpoints

### /chat

### for new chat
input
```json
{
  "input":"what are the symptoms of common cold",
  "start_new":true
}
```

response
```json
{
  "response":"Symptoms of common cold are ....",
  "session_id":"..."
}
```


### for continuing chat
input
```json
{
  "input":"give me some alternate medicine for the medicine i said",
  "start_new":false
  "session_id":"...."
}
```

response
```json
{
  "response":"okey! here are some alternate medications for ... that you mentioned, ...........",
  "session_id":"..."
}
```
