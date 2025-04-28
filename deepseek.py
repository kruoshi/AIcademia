from openai import OpenAI
import api_env
import os

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

def convergeKeywords(pass1,pass2,pass3):
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

try:
    #only for testing purposes
    poultry = "Illegal parking poses significant challenges in urban settings, disrupting traffic flow, exacerbating congestion, and reducing the efficiency of transportation systems. This project introduces a Computer Vision-Enhanced Real-Time Illegal Parking Detection and Monitoring System, which leverages advanced technologies such as YOLOv8 and IoT. The system integrates live CCTV surveillance to detect, log, and notify users of illegal parking incidents via a mobile application. Initial testing with a 960x1080n street CCTV surveillance camera resulted in 80% vehicle detection accuracy but showed car color recognition and license plate extraction inaccuracy in low-light conditions or beyond 10 meters hypotenuse distance from the camera. To address these limitations, the system was subsequently tested using a 1920x1080p camera, which yielded 100% vehicle detection accuracy across all testing conditions and increased color and license plate recognition accuracy. Functional testing confirmed the system's ability to detect vehicles with minimal latency (1-second average detection time, 4-second maximum delay), while integration testing demonstrated seamless communication between components with 100% reliability. User acceptance testing showed high satisfaction among stakeholders, underscoring the system's usability. Despite its strengths, limitations include reduced performance in adverse conditions, such as light pollution and significant occlusions. Enhancements such as higher-resolution cameras, night-vision capabilities, and multi-camera integration are recommended for future improvements. This system offers a scalable and efficient solution to enforce parking regulations, mitigate urban congestion, and improve road safety. The findings also highlight potential avenues for future research, including multi-camera integration, AI-driven low-light enhancement, and long-term stability testing to ensure robust performance in varied urban environments"
    pass1 = sendKeywordMessage(poultry)
    pass2 = sendKeywordMessage(poultry)
    pass3 = sendKeywordMessage(poultry)

    #print(("PART1\n"),pass1,("PART2\n"),pass2,("PART3\n"),pass3)

    keywords = convergeKeywords(pass1,pass2,pass3)

    print(keywords)





except Exception as e:
	print(e)


