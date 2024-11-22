import webbrowser
from googleapiclient.discovery import build
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import re

# Ensure nltk resources are downloaded
nltk.download('vader_lexicon')

# YouTube Data API key
api_key = "AIzaSyCjgNDyTKxsxZQDW0fL0Gi-VNhLjFWxUSQ"

# Create a YouTube resource object
youtube = build('youtube', 'v3', developerKey=api_key)

# Initialize sentiment analyzer
sia = SentimentIntensityAnalyzer()

# Function to search YouTube and get the first video URL
def search_youtube(query):
    request = youtube.search().list(
        part="snippet",
        maxResults=1,
        q=query
    )
    response = request.execute()

    if response['items']:
        video_id = response['items'][0]['id']['videoId']
        video_url = f"https://www.youtube.com/watch?v={video_id}"
        return video_url
    else:
        return None

# Function to perform a general web search
def search_web(query):
    search_url = f"https://www.google.com/search?q={query}"
    webbrowser.open(search_url)

# Function to provide suggestions based on sentiment
def provide_suggestion(sentiment):
    if sentiment['compound'] <= -0.2:  # Negative sentiment
        suggestions = [
            "Consider going for a walk or getting some fresh air.",
            "Try doing something you enjoy, like listening to your favorite music.",
            "Talk to a friend or family member about how you’re feeling.",
            "Engage in a relaxing activity, such as reading a book or meditating."
        ]
    elif sentiment['compound'] >= 0.2:  # Positive sentiment
        suggestions = [
            "Keep up the positive energy!",
            "Enjoy this moment of happiness!"
        ]
    else:
        suggestions = [
            "It sounds like you're feeling neutral. Would you like to talk about it?"
        ]

    print("Chatbot: Here are some suggestions:")
    for suggestion in suggestions:
        print(f"- {suggestion}")

# Function to analyze sentiment
def analyze_sentiment(text):
    score = sia.polarity_scores(text)
    return score

# Function to process user input and categorize emotion
def process_input(user_input):
    sentiment = analyze_sentiment(user_input)

    # If sentiment is negative, check if user wants suggestions
    if sentiment['compound'] <= -0.2:
        return "Chatbot: I’m sorry to hear that you’re feeling this way. Would you like some suggestions to help improve your mood?"

    # If sentiment is positive
    elif sentiment['compound'] >= 0.2:
        return "Chatbot: It’s great to hear that you’re feeling positive! Keep up the great mood!"

    return "Chatbot: That’s interesting. Can you tell me more about how you’re feeling?"

# Function to start the chatbot
def start_chat():
    print("Hello! I’m here to chat with you. How’s your day been?")
    loop_continue = True
    need_suggestions = False

    while loop_continue:
        try:
            user_input = input("You: ")

            if user_input.lower() == 'quit':
                print("Chatbot: Goodbye!")
                break

            # Process input and check sentiment
            response = process_input(user_input)
            print(response)

            if "Would you like some suggestions" in response:
                need_suggestions = True

            # If user wants suggestions, wait for answer
            if need_suggestions and ('yes' in user_input.lower() or 'okay' in user_input.lower()):
                provide_suggestion(analyze_sentiment(user_input))
                need_suggestions = False

            if need_suggestions and ('no' in user_input.lower() or 'not' in user_input.lower()):
                print("Chatbot: Is there anything I can do for you?")
                user_input = input("You: ")

                if 'no' in user_input.lower() or 'not' in user_input.lower():
                    print("Chatbot: Thank you for chatting with me. Take care!")
                    break
                else:
                    print("Chatbot: How can I help you?")
                    user_input = input("You: ")
                    if 'play' in user_input.lower():
                        search_query = user_input.lower().replace('play', '').strip()
                        video_url = search_youtube(search_query)
                        if video_url:
                            print(f"Opening YouTube for: {search_query}")
                            webbrowser.open(video_url)
                        else:
                            print("Chatbot: I couldn't find anything to play. Can I help you with something else?")
                    else:
                        search_web(user_input)
                        print("Chatbot: Is there anything else I can do for you?")

        except Exception as e:
            print(f"An error occurred: {e}")

# Start the chatbot
start_chat()
