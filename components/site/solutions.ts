/** Industry landing pages. Each targets the searches that business type actually makes. */
export type Solution = {
  slug: string;
  name: string;
  /** The name as it reads inside a sentence, with correct capitals. */
  phrase: string;
  short: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  h1: string;
  intro: string;
  chat: { from: 'customer' | 'bot'; text: string }[];
  questions: string[];
  benefits: { title: string; text: string }[];
  faq: { q: string; a: string }[];
};

export const SOLUTIONS: Solution[] = [
  {
    slug: 'ecommerce',
    name: 'E-commerce and online shopping',
    phrase: 'e-commerce and online stores',
    short: 'Answer product, order and delivery questions instantly, even during sales and festive rush.',
    seoTitle: 'WhatsApp Chatbot for E-commerce and Online Stores in India',
    seoDescription: 'Automate WhatsApp customer support for your online store. Sarabot answers product, price, stock, COD, delivery and return questions 24/7 and hands complex orders to your team. Free trial.',
    keywords: ['WhatsApp chatbot for ecommerce', 'WhatsApp bot for online store', 'ecommerce WhatsApp automation', 'WhatsApp order chatbot', 'Shopify WhatsApp chatbot India', 'WhatsApp customer support for online shopping'],
    h1: 'A WhatsApp chatbot for e-commerce and online stores',
    intro: 'Shoppers message you before they buy and after they order. Sarabot answers those messages in seconds, with your real prices, stock and delivery rules, so you sell more and spend less time typing the same replies.',
    chat: [
      { from: 'customer', text: 'Is the cotton kurta available in size L?' },
      { from: 'bot', text: 'Yes, the Blue Cotton Kurta is in stock in L for ₹899. Cash on delivery is available.' },
      { from: 'customer', text: 'How many days for delivery to Pune?' },
      { from: 'bot', text: 'Orders to Pune usually arrive in 3 to 5 working days. You get a tracking link once it ships.' },
    ],
    questions: ['Is this product in stock?', 'What is the price and is COD available?', 'When will my order arrive?', 'How do returns and exchanges work?', 'Do you have a discount code?', 'Can I change my delivery address?'],
    benefits: [
      { title: 'Answers from your product list', text: 'Add products with prices and stock. Sarabot quotes them exactly and never invents a product you don’t sell.' },
      { title: 'Handles the festive rush', text: 'Sale days bring hundreds of identical questions. The bot answers all of them at once, day and night.' },
      { title: 'Catalogues and offers on demand', text: 'When someone types “offers” or “catalogue”, send a ready reply with images or a PDF.' },
      { title: 'Your team closes the sale', text: 'Bulk orders, complaints and anything unusual are marked “Needs you” so a person replies.' },
    ],
    faq: [
      { q: 'Can a WhatsApp chatbot answer stock and price questions for my store?', a: 'Yes. Add your products with prices and stock in Sarabot. The bot answers from that list and says so when an item is out of stock.' },
      { q: 'Does it work with my existing WhatsApp Business number?', a: 'Yes. You link your number by scanning a QR code, like WhatsApp Web. You do not need a new number or the WhatsApp Business API.' },
      { q: 'Can it track orders from my website?', a: 'Sarabot answers order and delivery questions from the information you give it, such as delivery times and your tracking process. Order-specific questions it cannot answer are passed to your team.' },
    ],
  },
  {
    slug: 'grocery',
    name: 'Grocery and daily-use products',
    phrase: 'grocery and daily-use product stores',
    short: 'Take orders and answer price questions for kirana stores, supermarkets and daily-needs shops.',
    seoTitle: 'WhatsApp Chatbot for Grocery and Kirana Stores | Daily-use Products',
    seoDescription: 'Let customers check prices, stock and home delivery on WhatsApp, any time. Sarabot is a WhatsApp chatbot for grocery, kirana and daily-use product stores in India. Set up in 10 minutes.',
    keywords: ['WhatsApp chatbot for grocery store', 'kirana store WhatsApp bot', 'WhatsApp ordering for grocery', 'grocery home delivery WhatsApp', 'daily needs store WhatsApp automation', 'supermarket WhatsApp chatbot India'],
    h1: 'A WhatsApp chatbot for grocery stores and daily-use products',
    intro: 'Your regular customers already order on WhatsApp. Sarabot replies with prices, stock and delivery details while you serve the counter, and keeps answering after you close for the night.',
    chat: [
      { from: 'customer', text: 'What is the price of 5 kg wheat flour?' },
      { from: 'bot', text: 'Whole Wheat Flour 5 kg is ₹265 and in stock. Reply “order” to place an order.' },
      { from: 'customer', text: 'Do you deliver today?' },
      { from: 'bot', text: 'Yes, free home delivery within 3 km. Orders before 6 pm are delivered the same day.' },
    ],
    questions: ['What is the price of rice, oil or flour today?', 'Is this brand available?', 'Do you deliver at home?', 'What time do you open and close?', 'Do you accept UPI or cash on delivery?', 'Is there a minimum order for delivery?'],
    benefits: [
      { title: 'Prices that are always current', text: 'Update a price or mark an item out of stock in your dashboard, and the bot uses it from the next message.' },
      { title: 'Orders while you are busy', text: 'Customers send their list on WhatsApp. The bot confirms details and the order waits for you in Chat history.' },
      { title: 'Open after closing time', text: 'Use one bot during shop hours and another after hours that takes requests for the next morning.' },
      { title: 'Works on your shop number', text: 'No app for customers to download. They message the same number they already have saved.' },
    ],
    faq: [
      { q: 'Can a kirana store use a WhatsApp chatbot?', a: 'Yes. Sarabot is built for small shops. If you can scan a QR code and fill a simple form, you can set it up in about ten minutes.' },
      { q: 'How do customers place an order?', a: 'They message your WhatsApp number as usual. The bot answers prices and delivery questions and collects the order details, then you confirm and deliver.' },
      { q: 'Do I need to add every product?', a: 'No. Add your best-selling items first. For anything not in your list, the bot does not guess and passes the chat to you.' },
    ],
  },
  {
    slug: 'ngo',
    name: 'NGOs and non-profits',
    phrase: 'NGOs and non-profits',
    short: 'Answer donors, volunteers and beneficiaries on WhatsApp without adding staff.',
    seoTitle: 'WhatsApp Chatbot for NGOs and Non-profits in India',
    seoDescription: 'Respond to donors, volunteers and beneficiaries on WhatsApp 24/7. Sarabot helps NGOs share donation details, events and helpline information automatically. Affordable plans and a free trial.',
    keywords: ['WhatsApp chatbot for NGO', 'NGO WhatsApp automation', 'nonprofit chatbot India', 'WhatsApp bot for donations', 'volunteer management WhatsApp', 'charity WhatsApp chatbot'],
    h1: 'A WhatsApp chatbot for NGOs and non-profits',
    intro: 'Small teams get large volumes of the same questions: how to donate, how to volunteer, when the next camp is. Sarabot answers them on WhatsApp in any language your community writes in, so your team can focus on the work.',
    chat: [
      { from: 'customer', text: 'How can I donate to your education program?' },
      { from: 'bot', text: 'Thank you! You can donate by UPI or bank transfer. Reply “donate” and we’ll send the details and receipt process.' },
      { from: 'customer', text: 'I want to volunteer on weekends.' },
      { from: 'bot', text: 'Wonderful. Our weekend sessions run every Sunday, 10 am to 1 pm. Please share your name and city to register.' },
    ],
    questions: ['How do I donate and get a receipt?', 'How can I volunteer?', 'When and where is the next event or camp?', 'Who is eligible for your program?', 'What documents are needed to apply?', 'How can I contact your helpline?'],
    benefits: [
      { title: 'Never miss a donor', text: 'Donation questions get an instant, accurate reply with your payment and receipt process, even at midnight.' },
      { title: 'Volunteer sign-ups on WhatsApp', text: 'Share schedules and collect names and cities without a separate form.' },
      { title: 'Information in many languages', text: 'Beneficiaries can ask in the language they are comfortable with and get an answer in the same language.' },
      { title: 'Sensitive cases go to people', text: 'Anything the bot shouldn’t handle is marked “Needs you” for your team to answer personally.' },
    ],
    faq: [
      { q: 'Is a WhatsApp chatbot useful for a small NGO?', a: 'Yes. It answers repeated questions about donations, volunteering and events automatically, so a small team can respond to everyone quickly.' },
      { q: 'Can the bot share our donation and bank details?', a: 'Yes. Add them to your business information or as a quick reply, and the bot shares them exactly as you wrote them.' },
      { q: 'Will the bot send messages to our whole contact list?', a: 'No. Sarabot only replies to people who message you first. It does not send bulk or broadcast messages, which keeps your number safe.' },
    ],
  },
];

export const findSolution = (slug: string) => SOLUTIONS.find((s) => s.slug === slug);
