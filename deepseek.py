from openai import OpenAI
#import api_env
import os
import json
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

client = OpenAI(api_key=os.environ["API_KEY"], base_url="https://api.deepseek.com")

def sendKeywordMessage(userMessage):
    context = "You are a research assistant that is meant to gather the keywords most relevant to the project to be sent to you. These keywords should include the most important parts of the projects, as well as points of interest for any individual looking to search for references for their own project. List them out in a bulleted format. Do not include any other message. You must only provide the keywords and nothing else."

    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": context},
            {"role": "user", "content": userMessage},
        ],
        stream=False
    )
    return response.choices[0].message.content

def convergeKeywords(pass1, pass2, pass3):
    context = "You are a research assistant that is meant to gather the keywords most relevant to the project to be sent to you. These keywords should include the most important parts of the projects, as well as points of interest for any individual looking to search for references for their own project. You will be given a set of keywords that may or may not be duplicated. You must converge the similar items into one cohesive list. Reduce the amount of keywords to a sufficient amount. List them out in a CSV format. Do not include any other message. Avoid any and all use of parenthesis and other such symbols. You must only provide the keywords and nothing else."

    userMessage = pass1 + pass2 + pass3
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": context},
            {"role": "user", "content": userMessage},
        ],
        stream=False
    )
    return response.choices[0].message.content

def process_capstone_items():
    try:
        print("Querying for items without keywords...")
        response = supabase.table('capstones').select('id, title, abstract').is_('keywords', 'null').execute()
        
        if not response.data:
            print("No items found without keywords.")
            return
        
        print(f"Found {len(response.data)} items without keywords.")
        
        # Process each item
        for item in response.data:
            item_id = item['id']
            title = item.get('title', '')
            abstract = item.get('abstract', '')
            
            print(f"\nProcessing item {item_id}")
            print(f"Title: {title[:50]}..." if title else "No title")
            print(f"Abstract: {abstract[:50]}..." if abstract else "No abstract")
            
            if not title and not abstract:
                print(f"Item {item_id} has no title or abstract. Skipping.")
                continue
            
            content = f"Title: {title}\n\nAbstract: {abstract}"
            
            print(f"Generating keywords for item {item_id}...")
            pass1 = sendKeywordMessage(content)
            pass2 = sendKeywordMessage(content)
            pass3 = sendKeywordMessage(content)
            
            keywords = convergeKeywords(pass1, pass2, pass3)
            
            if isinstance(keywords, str):
                keywords_list = [keyword.strip() for keyword in keywords.split(',')]
            else:
                print(f"Warning: keywords is not a string, it's {type(keywords)}")
                keywords_list = keywords if isinstance(keywords, list) else [str(keywords)]
            
            keywords_list = [k for k in keywords_list if k]
            
            print(f"Keywords list: {keywords_list}")
            
            try:
                print("Using direct Python list approach")
                update_payload = {"keywords": keywords_list}
                
                print(f"Updating item {item_id}...")
                update_response = supabase.table('capstones').update(
                    update_payload
                ).eq('id', item_id).execute()
                
                print(f"Update successful for item {item_id}")
                
            except Exception as e:
                print(f"Error with direct list approach: {e}")
    
    except Exception as e:
        print(f"Error processing capstone items: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    process_capstone_items()
