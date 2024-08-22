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
from bson import ObjectId,Binary
from datetime import datetime

app = Flask(__name__)
CORS(app)

# MongoDB configuration
client = MongoClient('mongodb://localhost:27017/')
db = client['Fracture-Analysis']
collection = db['users']

# Model IDs
model_claude_sonnet_35 = "anthropic.claude-3-5-sonnet-20240620-v1:0"
model_claude_sonnet_30 = "anthropic.claude-3-sonnet-20240229-v1:0"
model_claude_haiku_30 = "anthropic.claude-3-haiku-20240307-v1:0"
model_claude_opus_30 = "anthropic.claude-3-opus-20240229-v1:0"

# Initializing the runtime client
runtime = boto3.client('bedrock-runtime')

# Default system prompt
sysprompt = "Generate a detailed radiology report based on the provided data and X-ray image as a guide. Your report should include: Anatomy Observed, Findings, Impression, and Recommendations."

# Conversation template
conversation_template = """You are an AI Radiologist Guide with detailed knowledge in human anatomy and bones.

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
        # Get the image file, prompt, and _id from the request
        image_file = request.files.get('image')
        prompt = request.form.get('prompt')
        _id = request.form.get('_id')

        if not image_file or not prompt or not _id:
            return jsonify({'error': 'Image, prompt, and _id fields are required'}), 400

        # Convert the _id to ObjectId
        user_object_id = ObjectId(_id)

        # Read the image file
        image_bytes = image_file.read()

        # Encode the image bytes to base64
        encoded_image = base64.b64encode(image_bytes).decode("utf-8")

        # Prepare the request body for the Bedrock model
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
                            {"type": "text", "text": sysprompt + prompt},
                        ],
                    }
                ],
            }
        )

        # Invoke the Bedrock model
        response = runtime.invoke_model(
            modelId=model_claude_haiku_30,
            body=body
        )

        response_body = json.loads(response.get("body").read())

        # Extract details from the response
        details = response_body['content'][0]['text']

        # Prepare the data for update with "details"
        image_response_data = {
            'details': details,  # Save response as "details"
            'image_data': encoded_image,
            'timestamp': datetime.utcnow(),
            'filename': image_file.filename
        }

        # Fetch the document by _id
        existing_document = collection.find_one({'_id': user_object_id})

        if existing_document:
            # If the document exists, update it
            collection.update_one(
                {'_id': user_object_id},
                {'$set': image_response_data}
            )
        else:
            # If the document does not exist, return an error
            return jsonify({'error': 'Document with the provided _id does not exist'}), 404

        # Fetch the updated document to include in the response
        updated_document = collection.find_one({'_id': user_object_id})
        updated_document['image_data'] = base64.b64encode(updated_document['image_data'].encode('utf-8')).decode('utf-8')

        return jsonify({'details': updated_document['details']})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5001)
