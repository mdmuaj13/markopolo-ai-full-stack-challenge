import httpx
from bs4 import BeautifulSoup, NavigableString, Tag
import re
from datetime import datetime, timedelta
import random

REMOVE_PATTERNS = [
    r"\b\d{1,2}:\d{2}(?:\s?(?:AM|PM))?\b",  # timestamps like 12:30, 8:45 PM
    r"©\s?\d{4}",                           # copyright year
]

def clean_text(text: str) -> str:
    text = text.strip()
    if not text:
        return ""
    for pattern in REMOVE_PATTERNS:
        text = re.sub(pattern, "", text)
    return text.strip()

async def scrape_website(url: str) -> list[dict]:
    async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
        response = await client.get(url)
        response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    # Remove unwanted tags completely
    for tag in soup(["script", "style", "noscript", "svg", "img", "picture"]):
        tag.decompose()

    json_data = []

    def traverse(node):
        if isinstance(node, NavigableString):
            return

        if not isinstance(node, Tag):
            return

        tag_name = node.name

        if tag_name in ["h1", "h2", "h3", "h4", "h5", "h6"]:
            text = clean_text(node.get_text(separator=" ", strip=True))
            if text:
                json_data.append({"tag": tag_name, "text": text})

        elif tag_name == "p":
            text = clean_text(node.get_text(separator=" ", strip=True))
            if text:
                json_data.append({"tag": "p", "text": text})

        elif tag_name in ["ul", "ol"]:
            items = [clean_text(li.get_text(separator=" ", strip=True)) for li in node.find_all("li")]
            items = [item for item in items if item]  # remove empty
            if items:
                json_data.append({"tag": tag_name, "items": items})

        elif tag_name == "a":
            text = clean_text(node.get_text(separator=" ", strip=True))
            href = node.get("href")
            if text and href:
                json_data.append({"tag": "a", "text": text, "href": href})

        # Recursively process children
        for child in node.children:
            traverse(child)

    traverse(soup.body or soup)

    return json_data


def get_facebook_page_mock_data(url: str) -> dict:
    """Generate mock Facebook page data"""
    page_names = [
        "TechStartup Hub", "Local Coffee Shop", "Fitness Revolution", "Art Gallery Downtown",
        "Green Garden Center", "Fashion Forward", "Food Truck Paradise", "Music Venue Live",
        "Pet Care Center", "Educational Academy", "Travel Adventures", "Home Decor Studio"
    ]

    page_name = random.choice(page_names)
    creation_date = datetime.now() - timedelta(days=random.randint(365, 2000))

    # Generate 20 mock posts
    posts = []
    post_templates = [
        "Just launched our new product! 🚀",
        "Thanks to all our amazing customers!",
        "Behind the scenes at {page_name}",
        "Weekend special offer - don't miss out!",
        "Customer spotlight: Amazing feedback!",
        "New team member joining us today!",
        "Celebrating another milestone 🎉",
        "Check out our latest project",
        "Community event this Saturday!",
        "Featured in local news today",
        "Summer sale starts tomorrow!",
        "Happy Monday motivation",
        "Throwback to when we started",
        "Collaboration announcement",
        "Workshop registration now open",
        "Client success story",
        "Industry insights and trends",
        "Seasonal menu updates",
        "Employee of the month",
        "Partnership announcement"
    ]

    for i in range(20):
        post_date = datetime.now() - timedelta(days=random.randint(1, 90))
        post_content = random.choice(post_templates).replace("{page_name}", page_name)

        posts.append({
            "id": f"post_{i+1}",
            "content": post_content,
            "date": post_date.isoformat(),
            "likes": random.randint(10, 500),
            "comments": random.randint(2, 50),
            "shares": random.randint(1, 25)
        })

    return {
        "page_name": page_name,
        "url": url,
        "likes": random.randint(1000, 50000),
        "followers": random.randint(800, 45000),
        "creation_date": creation_date.isoformat(),
        "category": random.choice(["Business", "Entertainment", "Education", "Health", "Technology"]),
        "verified": random.choice([True, False]),
        "posts": posts,
        "total_posts": len(posts),
        "avg_engagement": round(random.uniform(2.5, 8.5), 2)
    }


def get_crm_mock_data() -> dict:
    """Generate mock CRM customer data"""
    first_names = [
        "John", "Sarah", "Michael", "Emma", "David", "Lisa", "James", "Jessica",
        "Robert", "Ashley", "William", "Amanda", "Christopher", "Jennifer", "Daniel",
        "Nicole", "Matthew", "Michelle", "Anthony", "Stephanie", "Mark", "Elizabeth"
    ]

    last_names = [
        "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
        "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
        "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Thompson"
    ]

    products = [
        "Premium Subscription", "Basic Plan", "Pro Software License", "Consulting Service",
        "Training Course", "Mobile App", "Hardware Device", "Support Package",
        "Custom Development", "Data Analytics Tool", "Cloud Storage", "Security Suite"
    ]

    customers = []

    for i in range(15):  # Generate 15 customers
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        email = f"{first_name.lower()}.{last_name.lower()}@{random.choice(['gmail.com', 'yahoo.com', 'company.com', 'outlook.com'])}"

        # Generate order history (2-8 orders per customer)
        order_history = []
        num_orders = random.randint(2, 8)

        for j in range(num_orders):
            order_date = datetime.now() - timedelta(days=random.randint(1, 365))
            product = random.choice(products)
            amount = round(random.uniform(29.99, 999.99), 2)

            order_history.append({
                "order_id": f"ORD-{random.randint(100000, 999999)}",
                "date": order_date.isoformat(),
                "product": product,
                "amount": amount,
                "status": random.choice(["completed", "pending", "shipped", "delivered"]),
                "quantity": random.randint(1, 5)
            })

        # Sort orders by date (newest first)
        order_history.sort(key=lambda x: x["date"], reverse=True)

        customer = {
            "customer_id": f"CUST-{1000 + i}",
            "name": f"{first_name} {last_name}",
            "email": email,
            "phone_number": f"+1-{random.randint(200, 999)}-{random.randint(100, 999)}-{random.randint(1000, 9999)}",
            "registration_date": (datetime.now() - timedelta(days=random.randint(30, 730))).isoformat(),
            "total_orders": len(order_history),
            "total_spent": round(sum(order["amount"] for order in order_history), 2),
            "last_order_date": order_history[0]["date"] if order_history else None,
            "customer_status": random.choice(["active", "inactive", "vip", "new"]),
            "preferred_contact": random.choice(["email", "phone", "sms"]),
            "order_history": order_history
        }

        customers.append(customer)

    # Sort customers by total spent (highest first)
    customers.sort(key=lambda x: x["total_spent"], reverse=True)

    return {
        "total_customers": len(customers),
        "customers": customers,
        "summary": {
            "total_revenue": round(sum(customer["total_spent"] for customer in customers), 2),
            "avg_order_value": round(sum(customer["total_spent"] for customer in customers) / sum(customer["total_orders"] for customer in customers), 2),
            "active_customers": len([c for c in customers if c["customer_status"] == "active"]),
            "vip_customers": len([c for c in customers if c["customer_status"] == "vip"])
        }
    }
