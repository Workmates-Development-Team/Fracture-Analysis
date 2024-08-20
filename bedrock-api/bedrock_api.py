# # updated chatbot using langchain using claude sonnet 3.5
# # uses sessions and new_chat flag to manage sessions

import os
import uuid
import json
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_aws import ChatBedrock
from langchain_core.callbacks import StreamingStdOutCallbackHandler
from langchain_community.llms import Bedrock
from langchain_community.chat_models import BedrockChat
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain_core.prompts.prompt import PromptTemplate
import boto3
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)
CORS(app)

# MongoDB configuration
client = MongoClient('mongodb://localhost:27017/')  # Replace with your MongoDB connection string
db = client['ChatAppDB']
collection = db['image_responses']

# Model IDs
model_claude_sonnet_35 = "anthropic.claude-3-5-sonnet-20240620-v1:0"
model_claude_sonnet_30 = "anthropic.claude-3-sonnet-20240229-v1:0"
model_claude_haiku_30 = "anthropic.claude-3-haiku-20240307-v1:0"
model_claude_opus_30 = "anthropic.claude-3-opus-20240229-v1:0"

# Initializing the runtime client
runtime = boto3.client('bedrock-runtime')  # Example initialization

conversation_template = """The ChatmatesAI is a helpful assistant and loves to use emojis

Current conversation:
{history}
Human: {input}
ChatMatesAI:"""

memory = ConversationBufferMemory()
conversation = None

@app.route('/chat', methods=['POST'])
def chat():
    global conversation

    data = request.get_json()
    new_chat = data.get('new_chat', False)
    user_input = data.get('input', '')
    model_type = data.get('model_type', 'haiku')  # Default to Haiku 3.0

    if not user_input:
        return jsonify({'error': 'No input provided'}), 400

    # Reset conversation if new chat is requested
    if new_chat or conversation is None:
        if model_type == 'haiku':
            model_id = model_claude_haiku_30
        else:
            model_id = model_claude_sonnet_30

        llm = ChatBedrock(
            credentials_profile_name="default",
            provider="anthropic",
            model_id=model_id,
            streaming=True,
            callbacks=[StreamingStdOutCallbackHandler()],
        )

        memory.clear()  # Reset memory if new chat is requested
        conversation = ConversationChain(
            prompt=PromptTemplate(input_variables=["history", "input"], template=conversation_template),
            llm=llm,
            verbose=True,
            memory=memory,
        )

    session_number = str(uuid.uuid4())
    response = conversation.predict(input=user_input)
    return jsonify({"response": response, "session_number": session_number})

@app.route('/img', methods=['POST'])
def generate_image_response():
    try:
        # Get the image file, prompt, user_id, and token_id from the request
        image_file = request.files.get('image')
        prompt = request.form.get('prompt')
        user_id = request.form.get('user_id')
        token_id = request.form.get('token_id') or str(uuid.uuid4())

        if not image_file or not prompt or not user_id:
            return jsonify({'error': 'image, prompt, and user_id fields are required'}), 400

        # Read the image file
        image_bytes = image_file.read()

        # Encode the image bytes to base64
        encoded_image = base64.b64encode(image_bytes).decode("utf-8")

        body = json.dumps(
            {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 9999,
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image",
                                "source": {
                                    "type": "base64",
                                    "media_type": image_file.content_type,
                                    "data": encoded_image,
                                },
                            },
                            {"type": "text", "text": prompt},
                        ],
                    }
                ],
            }
        )

        response = runtime.invoke_model(
            modelId=model_claude_haiku_30,
            body=body
        )

        response_body = json.loads(response.get("body").read())

        # Save image data and response to MongoDB
        image_response_data = {
            'user_id': user_id,
            'token_id': token_id,
            'prompt': prompt,
            'response': response_body['content'][0]['text'],
            'image_data': encoded_image,
            'timestamp': datetime.utcnow()
        }
        collection.insert_one(image_response_data)

        return jsonify({'response': response_body['content'][0]['text'], 'token_id': token_id})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)



# import os
# import uuid
# import json
# import base64
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from langchain_aws import ChatBedrock
# from langchain_core.callbacks import StreamingStdOutCallbackHandler
# from langchain_community.llms import Bedrock
# from langchain_community.chat_models import BedrockChat
# from langchain.chains import ConversationChain
# from langchain.memory import ConversationBufferMemory
# from langchain_core.prompts.prompt import PromptTemplate
# import boto3


# app = Flask(__name__)
# CORS(app)

# # Model IDs
# model_claude_sonnet_35 = "anthropic.claude-3-5-sonnet-20240620-v1:0"
# model_claude_sonnet_30 = "anthropic.claude-3-sonnet-20240229-v1:0"
# model_claude_haiku_30 = "anthropic.claude-3-haiku-20240307-v1:0"
# model_claude_opus_30 = "anthropic.claude-3-opus-20240229-v1:0"

# # Initializing the runtime client
# runtime = boto3.client('bedrock-runtime')  # Example initialization

# conversation_template = """The ChatmatesAI is a helpful assistant and loves to use emojis

# Current conversation:
# {history}
# Human: {input}
# ChatMatesAI:"""

# memory = ConversationBufferMemory()
# conversation = None

# @app.route('/chat', methods=['POST'])
# def chat():
#     global conversation

#     data = request.get_json()
#     new_chat = data.get('new_chat', False)
#     user_input = data.get('input', '')
#     model_type = data.get('model_type', 'haiku')  # Default to Haiku 3.0

#     if not user_input:
#         return jsonify({'error': 'No input provided'}), 400

#     # Reset conversation if new chat is requested
#     if new_chat or conversation is None:
#         if model_type == 'haiku':
#             model_id = model_claude_haiku_30
#         else:
#             model_id = model_claude_sonnet_30

#         llm = ChatBedrock(
#             credentials_profile_name="default",
#             provider="anthropic",
#             model_id=model_id,
#             streaming=True,
#             callbacks=[StreamingStdOutCallbackHandler()],
#         )

#         memory.clear()  # Reset memory if new chat is requested
#         conversation = ConversationChain(
#             prompt=PromptTemplate(input_variables=["history", "input"], template=conversation_template),
#             llm=llm,
#             verbose=True,
#             memory=memory,
#         )

#     session_number = str(uuid.uuid4())
#     response = conversation.predict(input=user_input)
#     return jsonify({"response": response, "session_number": session_number})

# @app.route('/img', methods=['POST'])
# def generate_image_response():
#     try:
#         # Get the image file and prompt from the request
#         image_file = request.files.get('image')
#         prompt = request.form.get('prompt')
#         token_id = request.form.get('token_id') or str(uuid.uuid4())

#         if not image_file or not prompt:
#             return jsonify({'error': 'image and prompt field are required'}), 400

#         # Read the image file
#         image_bytes = image_file.read()

#         # Encode the image bytes to base64
#         encoded_image = base64.b64encode(image_bytes).decode("utf-8")

#         body = json.dumps(
#             {
#                 "anthropic_version": "bedrock-2023-05-31",
#                 "max_tokens": 9999,
#                 "messages": [
#                     {
#                         "role": "user",
#                         "content": [
#                             {
#                                 "type": "image",
#                                 "source": {
#                                     "type": "base64",
#                                     "media_type": image_file.content_type,
#                                     "data": encoded_image,
#                                 },
#                             },
#                             {"type": "text", "text": prompt},
#                         ],
#                     }
#                 ],
#             }
#         )

#         response = runtime.invoke_model(
#             modelId=model_claude_haiku_30,
#             body=body
#         )

#         response_body = json.loads(response.get("body").read())

#         # # Save image data and response to MongoDB (mock implementation here)
#         # save_image_to_db(token_id, image_bytes, image_file.content_type)
#         # save_chat_to_db(token_id, prompt, response_body['content'][0]['text'])

#         return jsonify({'response': response_body['content'][0]['text'], 'token_id': token_id})

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


# if __name__ == '__main__':
#     app.run(host='0.0.0.0', debug=True)
