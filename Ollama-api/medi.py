from flask import Flask, request, jsonify
from langchain.prompts import PromptTemplate
#from langchain.llms import OllamaLLM
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain_ollama.llms import OllamaLLM
import uuid

app = Flask(__name__)

# Initialize the LLM and the prompt template
gemma2b = "gemma:2b"
qwen05b = "qwen2:0.5b"
qwen15b = "qwen2:1.5b"
phi3 = "phi3:latest"
phi14="phi3:14b"
llama31 = "llama3.1:latest"
meditron = "meditron:7b"


llm = OllamaLLM(model=phi14)
template = """ You are a helpful medical Assistant,You can suggest alternate medicines and you give medical advise on {input}

History: {history}
Question: {input}
Answer:  """
PROMPT = PromptTemplate(input_variables=["history", "input"], template=template)

# Dictionary to store active sessions
sessions = {}

@app.route('/chat', methods=['POST'])
def chat_endpoint():
    data = request.json
    session_number = data.get('session_number')
    input_text = data.get('input', "")
    start_new = data.get('start_new', False)

    # Check if a new session is needed
    if start_new or session_number not in sessions:
        session_number = str(uuid.uuid4())
        memory = ConversationBufferMemory()
        conversation = ConversationChain(prompt=PROMPT, llm=llm, verbose=True, memory=memory)
        sessions[session_number] = conversation
    else:
        conversation = sessions[session_number]

    # Generate the response
    response = conversation.predict(input=input_text)

    return jsonify({"response": response, "session_number": session_number})

if __name__ == '__main__':
    app.run(debug=True, port=4000, host='0.0.0.0')