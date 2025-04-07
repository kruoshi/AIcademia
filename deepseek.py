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
    context = "You are a research assistant that is meant to gather the keywords most relevant to the project to be sent to you. These keywords should include the most important parts of the projects, as well as points of interest for any individual looking to search for references for their own project. You will be given a set of keywords that may or may not be duplicated. You must converge the similar items into one cohesive list. Reduce the amount of keywords to a sufficient amount. List them out in a bulleted format. Do not include any other message. Avoid any and all use of parenthesis and other such symbols. You must only provide the keywords and nothing else."

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
    poultry = "The Automated Heat Stress Monitoring and Management System for Poultry Farming is designed to address heat stress challenges in poultry production. The system integrates a network of sensors, including an AMG8833 thermal camera, a DHT22 temperature and humidity sensor, and an MQ-137 gas sensor, to monitor environmental conditions within a poultry house continuously. Data from these sensors is processed by a Raspberry Pi 3 Model B+, which controls output devices such as cooling fans, an exhaust fan, a heat lamp, and motorized windows. The system operates autonomously, adjusting these devices based on predefined thresholds or custom user-defined values via a mobile application built on the Blynk platform. This app enables real-time monitoring and remote control, aiming to improve poultry health and productivity by mitigating the effects of heat stress. A comparative study evaluated the system's effectiveness, raising one group of chicks in the automated environment while another group was kept in an unregulated setting. The results showed that the chicks in the controlled environment experienced no fatalities, compared to one fatality in the unregulated environment. The average weight gain of chicks in the controlled environment was 142.77g higher than those in the unregulated environment, representing a 12.65% increase. At the end of the testing period, the total weight difference was 3410.00g, an 18.87% advantage for the chicks raised in the automated system. This highlights the system's potential to improve poultry farming practices. Future enhancements include upgrading the power supply, improving internet reliability, and exploring additional environmental factors to further optimize poultry health and productivity."
    pass1 = sendKeywordMessage(poultry)
    pass2 = sendKeywordMessage(poultry)
    pass3 = sendKeywordMessage(poultry)

    #print(("PART1\n"),pass1,("PART2\n"),pass2,("PART3\n"),pass3)

    print(convergeKeywords(pass1,pass2,pass3))


except Exception as e:
	print(e)


