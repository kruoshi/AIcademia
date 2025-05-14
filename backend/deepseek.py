import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv(dotenv_path='../frontend/.env.local')

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
    base_url="https://api.deepseek.com"
)

def sendKeywordMessage(content):
    context = "You are a research assistant that is meant to gather the keywords most relevant to the project to be sent to you. These keywords should include the most important parts of the projects, as well as points of interest for any individual looking to search for references for their own project. You will be given a set of keywords that may or may not be duplicated. You must converge the similar items into one cohesive list. Reduce the amount of keywords to a sufficient amount. List them out in a CSV format. Do not include any other message. Avoid any and all use of parenthesis and other such symbols. You must only provide the keywords and nothing else."
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": context},
            {"role": "user", "content": content},
        ],
        stream=False
    )
    return response.choices[0].message.content


def convergeKeywords(pass1, pass2, pass3):
    context = "You are a research assistant that is meant to gather the keywords most relevant to the project to be sent to you. These keywords should include the most important parts of the projects, as well as points of interest for any individual looking to search for references for their own project. You will be given a set of keywords that may or may not be duplicated. You must converge the similar items into one cohesive list. Reduce the amount of keywords to a sufficient amount. List them out in a CSV format. Do not include any other message. Avoid any and all use of parenthesis and other such symbols. You must only provide the keywords and nothing else."
    merged_input = pass1 + "\n" + pass2 + "\n" + pass3

    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": context},
            {"role": "user", "content": merged_input},
        ],
        stream=False
    )
    return response.choices[0].message.content


def extract_keywords(title, abstract):
    content = f"Title: {title}\n\nAbstract: {abstract}"
    p1 = sendKeywordMessage(content)
    p2 = sendKeywordMessage(content)
    p3 = sendKeywordMessage(content)
    merged = convergeKeywords(p1, p2, p3)
    return [k.strip() for k in merged.split(',') if k.strip()]
