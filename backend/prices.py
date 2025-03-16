from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import time
import random
import os
import urllib3
import requests
from bs4 import BeautifulSoup

# Path to ChromeDriver
chrome_driver_path = "C:\\Users\\Yesmi\\OneDrive\\Desktop\\chromedriver-win64\\chromedriver.exe"

# Set up Chrome options with SSL error bypass
chrome_options = Options()
chrome_options.add_argument("--ignore-certificate-errors")
chrome_options.add_argument("--ignore-ssl-errors")
chrome_options.add_argument("--disable-web-security")
chrome_options.add_argument("--allow-running-insecure-content")
chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36")

# Disable SSL warnings for requests
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Initialize the WebDriver service
service = Service(executable_path=chrome_driver_path)

# Initialize the WebDriver
driver = webdriver.Chrome(service=service, options=chrome_options)
driver.maximize_window()

# Load existing product data if the file exists
all_product_data = []
if os.path.exists('all_products_data.json'):
    try:
        with open('all_products_data.json', 'r', encoding='utf-8') as json_file:
            all_product_data = json.load(json_file)
        print(f"Loaded {len(all_product_data)} existing products from file.")
    except Exception as e:
        print(f"Error loading existing data: {e}")
        all_product_data = []

# Function to extract product details from eHardware
def extract_ehardware_product_details(product_url):
    try:
        driver.get(product_url)
        time.sleep(random.uniform(1, 3))
        
        # Wait until the page is fully loaded
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.TAG_NAME, 'body'))
        )
        
        # Product Name
        try:
            product_name_element = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.XPATH, '//h1[@class="product_title entry-title"]'))
            )
            product_name = product_name_element.text.strip()
        except:
            try:
                product_name_element = driver.find_element(By.XPATH, '//div[@class="product-name"]/a')
                product_name = product_name_element.text.strip()
            except:
                product_name = "N/A"
        
        # Price
        try:
            price_element = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.XPATH, '//div[@class="price-box"]//div[@class="price-box-inner"]'))
            )
            price_value = price_element.text.strip()
        except:
            try:
                price_element = driver.find_element(By.XPATH, '//p[@class="price"]//span[@class="woocommerce-Price-amount amount"]')
                price_value = price_element.text.strip()
            except:
                price_value = "N/A"
                
        print(f"Extracted from eHardware: {product_name} - {price_value}")
        
        return {
            'name': product_name,
            'price': price_value,
            'link': product_url,
            'source': 'ehardware.lk'
        }
    except Exception as e:
        print(f"Error extracting details from {product_url}: {e}")
        return None

# Function to extract paints data using requests and BeautifulSoup (alternative to Selenium)
def scrape_paints_with_requests():
    print("\nScraping Paints.lk using requests...")
    products_found = 0
    paint_products = []
    
    # Category URL
    base_url = "https://paints.lk/product-category/decorative-paint/interior-wall-paint/"
    page = 1
    has_next_page = True
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }
    
    while has_next_page:
        current_url = f"{base_url}page/{page}/" if page > 1 else base_url
        print(f"  Scraping page {page}: {current_url}")
        
        try:
            # Make request with SSL verification disabled
            response = requests.get(current_url, headers=headers, verify=False, timeout=30)
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Find product containers
                product_elements = soup.select('li.product')
                
                if not product_elements:
                    print("  No products found on this page")
                    break
                    
                print(f"  Found {len(product_elements)} paint products on page {page}")
                
                for product in product_elements:
                    try:
                        # Extract product details
                        product_link_element = product.select_one('a.woocommerce-LoopProduct-link')
                        if not product_link_element:
                            continue
                            
                        product_link = product_link_element.get('href')
                        product_name = product.select_one('h2.woocommerce-loop-product__title')
                        product_name = product_name.text.strip() if product_name else "N/A"
                        
                        # Extract price
                        price_element = product.select_one('span.price, span.woocommerce-Price-amount')
                        price = price_element.text.strip() if price_element else "N/A"
                        
                        # Create product data
                        product_data = {
                            'name': product_name,
                            'price': price,
                            'link': product_link,
                            'source': 'paints.lk',
                            'category': 'interior wall paint'
                        }
                        
                        paint_products.append(product_data)
                        products_found += 1
                        print(f"  Extracted: {product_name} - {price}")
                        
                    except Exception as e:
                        print(f"  Error extracting product: {e}")
                
                # Check for next page
                next_page_link = soup.select_one('a.next.page-numbers')
                if next_page_link:
                    page += 1
                else:
                    print("  No more pages found")
                    has_next_page = False
            else:
                print(f"  Failed to load page: HTTP {response.status_code}")
                has_next_page = False
                
        except Exception as e:
            print(f"  Error processing page {page}: {e}")
            has_next_page = False
    
    # If we found products, try to get additional details
    for i, product in enumerate(paint_products):
        if 'link' in product and product['link']:
            print(f"  Getting detailed info for paint product {i+1}/{len(paint_products)}")
            try:
                # Fetch product page
                response = requests.get(product['link'], headers=headers, verify=False, timeout=30)
                if response.status_code == 200:
                    product_soup = BeautifulSoup(response.text, 'html.parser')
                    
                    # Try to get more accurate price from product page
                    detailed_price = product_soup.select_one('p.price span.woocommerce-Price-amount')
                    if detailed_price:
                        product['price'] = detailed_price.text.strip()
                    
                    # Get product description if available
                    description = product_soup.select_one('div.woocommerce-product-details__short-description')
                    if description:
                        product['description'] = description.text.strip()
                        
                    # Get product image if available
                    image = product_soup.select_one('div.woocommerce-product-gallery__image img')
                    if image and 'src' in image.attrs:
                        product['image_url'] = image['src']
                        
                time.sleep(random.uniform(1, 2))
            except Exception as e:
                print(f"  Error getting detailed info: {e}")
    
    # Add all paint products to our main data list
    all_product_data.extend(paint_products)
    
    return products_found

# Function to scrape eHardware
def scrape_ehardware():
    # List of category URLs to scrape for eHardware
    category_urls = [
        "https://www.ehardware.lk/product-category/building/"
    ]
    
    products_found = 0
    
    # Iterate through each category URL and extract products
    for category_url in category_urls:
        print(f"\nScraping eHardware category: {category_url}")
        
        try:
            driver.get(category_url)
            time.sleep(random.uniform(2, 4))
            
            # Find all product links
            try:
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.XPATH, '//div[contains(@class, "product-name")]/a'))
                )
                product_links_elements = driver.find_elements(By.XPATH, '//div[contains(@class, "product-name")]/a')
                
                product_links = []
                for link in product_links_elements:
                    href = link.get_attribute('href')
                    if href:
                        product_links.append(href)
                
                print(f"  Found {len(product_links)} eHardware product links")
                
                # Extract details from each product link
                for i, product_url in enumerate(product_links):
                    print(f"  Processing eHardware product {i+1}/{len(product_links)}: {product_url}")
                    product_details = extract_ehardware_product_details(product_url)
                    if product_details:
                        all_product_data.append(product_details)
                        products_found += 1
                    time.sleep(random.uniform(1, 3))
                    
            except Exception as e:
                print(f"  Failed to find eHardware product links: {e}")
                
        except Exception as e:
            print(f"Error processing eHardware category {category_url}: {e}")
    
    return products_found

# Close the WebDriver
driver.quit()
















