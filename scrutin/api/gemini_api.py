import google.generativeai as genai

def configure_genai():

    genini_api_key = "AIzaSyA9wBCx0OZZtWi11BHxWuqumwr9vVrVzkA"
    genai.configure(api_key=genini_api_key)

    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = input("enter prompt: ")
    response = model.generate_content(prompt)
    print(response.text)

if __name__ == "__main__":
    configure_genai()
