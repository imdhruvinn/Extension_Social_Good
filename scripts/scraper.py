import requests
from bs4 import BeautifulSoup
from urllib.parse import unquote

def scrape_page_content(url):
    """Scrape webpage content."""
    # Decode the URL in case it's URL-encoded
    url = unquote(url)

    try:
        # Send request to fetch the page content
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for 4xx/5xx responses

        # Parse the content with BeautifulSoup
        soup = BeautifulSoup(response.content, 'html.parser')

        # Debug: print the full HTML to check the content structure
        print(soup.prettify())  # Debugging line to view the page's structure

        # Extract meta description and keywords (including Open Graph tags)
        description = soup.find('meta', attrs={'name': 'description'}) or soup.find('meta', attrs={'property': 'og:description'})
        keywords = soup.find('meta', attrs={'name': 'keywords'}) or soup.find('meta', attrs={'property': 'og:keywords'})

        meta_description = description['content'] if description else ""
        meta_keywords = keywords['content'] if keywords else ""

        # Extract paragraphs and content from relevant sections
        paragraphs = soup.find_all('p')
        content = ' '.join(paragraph.text for paragraph in paragraphs)

        # Add more content from other important sections if needed (e.g., <h1>, <h2>, <article>, <main>)
        headers = soup.find_all(['h1', 'h2', 'h3'])
        content += ' '.join(header.text for header in headers)

        # Check if there are any <main> or <article> tags, often used for body content
        main_content = soup.find(['main', 'article'])
        if main_content:
            content += ' ' + main_content.get_text(separator=' ', strip=True)

        # If content is still too short, combine it with title or description
        if len(content.split()) < 50:  # Arbitrary threshold to consider content too short
            title = soup.title.string if soup.title else ""
            content = f"{meta_description} {title} {content}"

        # Debugging: If the extracted content is still empty, show what was scraped
        if not meta_description and not meta_keywords and not content:
            print("Warning: No relevant content extracted!")
            print(f"Scraped data: {meta_description}, {meta_keywords}, {content}")

        return {
            "meta_keywords": meta_keywords,
            "meta_description": meta_description,
            "content": content
        }

    except requests.exceptions.RequestException as e:
        print(f"Error fetching page content: {e}")
        return {"meta_keywords": "", "meta_description": "", "content": ""}

def generate_hashtags(keywords):
    """Generate hashtags from keywords."""
    return [f"#{word.strip()}" for word in keywords.split(",")]

def summarize_text(text, summarizer):
    """Summarize text using a pre-trained transformer model."""
    try:
        # If the text is too short, return it as is
        if len(text.split()) < 50:
            return text

        summary = summarizer(text, max_length=150, min_length=40, do_sample=False)
        return summary[0]['summary_text']
    except Exception as e:
        print(f"Error summarizing text: {e}")
        return "Summary not available"
